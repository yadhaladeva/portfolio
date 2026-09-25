package com.deva.portfolio.service;

import com.deva.portfolio.exception.ApiException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Service providing integration with Supabase Object Storage via REST API.
 * Handles bucket auto-provisioning, object upload, secure download, deletion, and public URL generation.
 * Falls back gracefully when Supabase credentials are not configured (e.g., local development).
 */
@Service
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(20);

    @Value("${supabase.url:}")
    private String rawSupabaseUrl;

    @Value("${supabase.key:}")
    private String supabaseKey;

    @Value("${supabase.bucket.certifications:portfolio-certifications}")
    private String certificationsBucket;

    @Value("${supabase.bucket.resumes:portfolio-resumes}")
    private String resumesBucket;

    private String supabaseBaseUrl;
    private HttpClient httpClient;
    private boolean configured = false;

    @PostConstruct
    public void init() {
        if (StringUtils.hasText(rawSupabaseUrl) && StringUtils.hasText(supabaseKey)) {
            this.supabaseBaseUrl = rawSupabaseUrl.trim().replaceAll("/+$", "");
            this.httpClient = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();
            this.configured = true;
            log.info("Supabase Storage Service configured successfully for URL: {}", this.supabaseBaseUrl);

            // Auto-provision default buckets if permissions allow
            ensureBucketExists(certificationsBucket, true);
            ensureBucketExists(resumesBucket, true);
        } else {
            log.info("Supabase Storage is not configured (SUPABASE_URL or SUPABASE_KEY missing). Falling back to local disk storage.");
            this.configured = false;
        }
    }

    /**
     * Checks if Supabase Storage is configured and ready for operations.
     */
    public boolean isConfigured() {
        return configured;
    }

    public String getCertificationsBucket() {
        return certificationsBucket;
    }

    public String getResumesBucket() {
        return resumesBucket;
    }

    /**
     * Ensures that the requested bucket exists. If not, attempts to create it with public access.
     */
    public void ensureBucketExists(String bucketName, boolean isPublic) {
        if (!configured || !StringUtils.hasText(bucketName)) return;

        try {
            String url = supabaseBaseUrl + "/storage/v1/bucket";
            String jsonBody = String.format("{\"id\":\"%s\",\"name\":\"%s\",\"public\":%b}", bucketName, bucketName, isPublic);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey.trim())
                    .header("apikey", supabaseKey.trim())
                    .header("Content-Type", "application/json")
                    .timeout(REQUEST_TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200 || response.statusCode() == 201) {
                log.info("Supabase Storage bucket '{}' created successfully (public={}).", bucketName, isPublic);
            } else if (response.statusCode() == 400 || response.statusCode() == 409) {
                log.debug("Supabase Storage bucket '{}' already exists or is initialized.", bucketName);
            } else {
                log.warn("Supabase Storage bucket check/create returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("Could not automatically check/create Supabase bucket '{}': {}", bucketName, e.getMessage());
        }
    }

    /**
     * Uploads raw bytes to a Supabase Storage bucket object path.
     *
     * @param bucketName  Target bucket name
     * @param objectPath  Target object path/filename
     * @param data        Binary content of the file
     * @param contentType MIME type of the file
     * @return Full Supabase Storage identifier URI (e.g., supabase://portfolio-certifications/cert_123.pdf)
     */
    public String uploadFile(String bucketName, String objectPath, byte[] data, String contentType) {
        if (!configured) {
            throw new ApiException("Supabase Storage is not configured.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String sanitizedPath = sanitizePath(objectPath);
        String url = String.format("%s/storage/v1/object/%s/%s", supabaseBaseUrl, bucketName, sanitizedPath);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey.trim())
                    .header("apikey", supabaseKey.trim())
                    .header("Content-Type", StringUtils.hasText(contentType) ? contentType : "application/octet-stream")
                    .header("x-upsert", "true")
                    .timeout(REQUEST_TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(data))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Successfully uploaded file to Supabase Storage: bucket='{}', path='{}' ({} bytes)",
                        bucketName, sanitizedPath, data.length);
                return "supabase://" + bucketName + "/" + sanitizedPath;
            } else {
                log.error("Failed to upload file to Supabase Storage (status {}): {}", response.statusCode(), response.body());
                throw new ApiException("Failed to upload file to Supabase Storage: " + response.body(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.error("Error uploading to Supabase Storage: {}", e.getMessage(), e);
            throw new ApiException("Error communicating with Supabase Storage: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Downloads file content bytes from Supabase Storage.
     *
     * @param bucketName Target bucket
     * @param objectPath Target object path
     * @return Byte array of the downloaded file
     */
    public byte[] downloadFile(String bucketName, String objectPath) {
        if (!configured) {
            throw new ApiException("Supabase Storage is not configured.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String sanitizedPath = sanitizePath(objectPath);
        // Try authenticated endpoint first (works for both public and private buckets)
        String url = String.format("%s/storage/v1/object/authenticated/%s/%s", supabaseBaseUrl, bucketName, sanitizedPath);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey.trim())
                    .header("apikey", supabaseKey.trim())
                    .timeout(REQUEST_TIMEOUT)
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return response.body();
            }

            // Fallback to public endpoint if authenticated returned 404 or forbidden
            String publicUrl = String.format("%s/storage/v1/object/public/%s/%s", supabaseBaseUrl, bucketName, sanitizedPath);
            HttpRequest publicRequest = HttpRequest.newBuilder()
                    .uri(URI.create(publicUrl))
                    .timeout(REQUEST_TIMEOUT)
                    .GET()
                    .build();

            HttpResponse<byte[]> publicResponse = httpClient.send(publicRequest, HttpResponse.BodyHandlers.ofByteArray());
            if (publicResponse.statusCode() >= 200 && publicResponse.statusCode() < 300) {
                return publicResponse.body();
            }

            log.error("Failed to download file from Supabase Storage '{}': status {}", sanitizedPath, response.statusCode());
            throw new ApiException("Certificate/Resume file not found in Supabase Storage.", HttpStatus.NOT_FOUND);
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.error("Error downloading from Supabase Storage: {}", e.getMessage(), e);
            throw new ApiException("Failed to retrieve file from Supabase Storage: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes an object from Supabase Storage.
     *
     * @param bucketName Target bucket
     * @param objectPath Target object path
     */
    public void deleteFile(String bucketName, String objectPath) {
        if (!configured || !StringUtils.hasText(objectPath)) return;

        String sanitizedPath = sanitizePath(objectPath);
        String url = String.format("%s/storage/v1/object/%s/%s", supabaseBaseUrl, bucketName, sanitizedPath);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + supabaseKey.trim())
                    .header("apikey", supabaseKey.trim())
                    .timeout(REQUEST_TIMEOUT)
                    .DELETE()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Deleted object from Supabase Storage: bucket='{}', path='{}'", bucketName, sanitizedPath);
            } else {
                log.warn("Supabase Storage delete returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("Could not delete object from Supabase Storage ('{}'): {}", sanitizedPath, e.getMessage());
        }
    }

    /**
     * Generates the public CDN URL for an object in a public Supabase Storage bucket.
     */
    public String getPublicUrl(String bucketName, String objectPath) {
        if (!StringUtils.hasText(supabaseBaseUrl)) return "";
        return String.format("%s/storage/v1/object/public/%s/%s", supabaseBaseUrl, bucketName, sanitizePath(objectPath));
    }

    /**
     * Parses a storage path URI (e.g., supabase://portfolio-certifications/cert_123.pdf) into [bucket, objectPath].
     *
     * @param storagePath Storage path or URI
     * @return String array of [bucket, objectPath] or null if not a Supabase URI
     */
    public static String[] parseSupabaseUri(String storagePath) {
        if (storagePath == null || !storagePath.startsWith("supabase://")) {
            return null;
        }
        String stripped = storagePath.substring("supabase://".length());
        int slashIndex = stripped.indexOf('/');
        if (slashIndex > 0 && slashIndex < stripped.length() - 1) {
            String bucket = stripped.substring(0, slashIndex);
            String path = stripped.substring(slashIndex + 1);
            return new String[]{bucket, path};
        }
        return null;
    }

    public static boolean isSupabaseStoragePath(String storagePath) {
        return storagePath != null && storagePath.startsWith("supabase://");
    }

    private String sanitizePath(String path) {
        if (path == null) return "";
        String clean = path.trim().replace('\\', '/');
        while (clean.startsWith("/")) {
            clean = clean.substring(1);
        }
        return clean;
    }
}
