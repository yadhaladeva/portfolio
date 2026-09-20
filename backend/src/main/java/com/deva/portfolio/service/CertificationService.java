package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.CertificationRequest;
import com.deva.portfolio.dto.response.CertificationResponse;
import com.deva.portfolio.entity.Certification;
import com.deva.portfolio.exception.ApiException;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.CertificationRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service managing Certification records, file storage, validation, replacement, and stream views.
 */
@Service
@RequiredArgsConstructor
public class CertificationService {

    private static final Logger log = LoggerFactory.getLogger(CertificationService.class);
    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    private static final Map<String, String> EXTENSION_MIME_MAP = Map.of(
            "pdf", "application/pdf",
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "webp", "image/webp"
    );

    private final CertificationRepository certificationRepository;

    @Value("${certification.upload.dir:./data/uploads/certifications}")
    private String uploadDir;

    private Path storageLocation;

    @PostConstruct
    public void init() {
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
            log.info("Certifications storage initialized at: {}", this.storageLocation);
        } catch (IOException e) {
            log.error("Could not initialize certifications storage directory: {}", e.getMessage());
            throw new ApiException("Could not initialize certifications storage directory", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public List<CertificationResponse> getAllCertifications() {
        return certificationRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(CertificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CertificationResponse getCertificationById(Long id) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));
        return CertificationResponse.fromEntity(cert);
    }

    @Transactional
    public CertificationResponse createCertification(CertificationRequest request, MultipartFile file) {
        Certification cert = Certification.builder()
                .name(request.getName().trim())
                .issuer(request.getIssuer().trim())
                .issuedDate(request.getIssuedDate() != null ? request.getIssuedDate().trim() : null)
                .credentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        if (file != null && !file.isEmpty()) {
            StoredFileInfo storedFile = storeFile(file);
            cert.setFileName(storedFile.safeStorageName());
            cert.setOriginalFileName(storedFile.originalFileName());
            cert.setContentType(storedFile.contentType());
            cert.setFileSize(storedFile.fileSize());
            cert.setStoragePath(storedFile.storagePath());
            cert.setUploadedAt(LocalDateTime.now());
        }

        Certification saved = certificationRepository.save(cert);
        log.info("Created certification ID {} ('{}')", saved.getId(), saved.getName());
        return CertificationResponse.fromEntity(saved);
    }

    @Transactional
    public CertificationResponse updateCertification(Long id, CertificationRequest request, MultipartFile file) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        cert.setName(request.getName().trim());
        cert.setIssuer(request.getIssuer().trim());
        cert.setIssuedDate(request.getIssuedDate() != null ? request.getIssuedDate().trim() : null);
        cert.setCredentialUrl(request.getCredentialUrl() != null ? request.getCredentialUrl().trim() : null);
        if (request.getDisplayOrder() != null) {
            cert.setDisplayOrder(request.getDisplayOrder());
        }

        // Handle certificate removal request
        if (Boolean.TRUE.equals(request.getRemoveCertificate())) {
            deletePhysicalFile(cert.getStoragePath());
            cert.setFileName(null);
            cert.setOriginalFileName(null);
            cert.setContentType(null);
            cert.setFileSize(null);
            cert.setStoragePath(null);
            cert.setUploadedAt(null);
            log.info("Removed certificate file from certification ID {}", id);
        }

        // Handle certificate upload / replacement
        if (file != null && !file.isEmpty()) {
            // Delete existing physical file if replacing
            deletePhysicalFile(cert.getStoragePath());

            StoredFileInfo storedFile = storeFile(file);
            cert.setFileName(storedFile.safeStorageName());
            cert.setOriginalFileName(storedFile.originalFileName());
            cert.setContentType(storedFile.contentType());
            cert.setFileSize(storedFile.fileSize());
            cert.setStoragePath(storedFile.storagePath());
            cert.setUploadedAt(LocalDateTime.now());
            log.info("Uploaded/replaced certificate file for certification ID {}", id);
        }

        Certification updated = certificationRepository.save(cert);
        return CertificationResponse.fromEntity(updated);
    }

    @Transactional
    public CertificationResponse removeCertificateFile(Long id) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        deletePhysicalFile(cert.getStoragePath());
        cert.setFileName(null);
        cert.setOriginalFileName(null);
        cert.setContentType(null);
        cert.setFileSize(null);
        cert.setStoragePath(null);
        cert.setUploadedAt(null);

        Certification updated = certificationRepository.save(cert);
        log.info("Removed certificate file only for certification ID {}", id);
        return CertificationResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteCertification(Long id) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        // Delete associated physical certificate file if present
        deletePhysicalFile(cert.getStoragePath());

        certificationRepository.delete(cert);
        log.info("Deleted certification ID {} and its associated file if present.", id);
    }

    public ResourceAndMetadata loadCertificateResource(Long id) {
        Certification cert = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        if (cert.getStoragePath() == null || cert.getStoragePath().isBlank()) {
            throw new ResourceNotFoundException("No certificate file is attached to certification ID " + id);
        }

        try {
            Path filePath = Paths.get(cert.getStoragePath()).normalize();
            if (!filePath.startsWith(this.storageLocation)) {
                throw new ApiException("Access to requested certificate path is denied.", HttpStatus.FORBIDDEN);
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = cert.getContentType() != null ? cert.getContentType() : "application/octet-stream";
                String originalName = cert.getOriginalFileName() != null ? cert.getOriginalFileName() : "certificate";
                return new ResourceAndMetadata(resource, contentType, originalName);
            } else {
                throw new ResourceNotFoundException("Certificate file not found on disk for certification ID " + id);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Certificate file location is invalid.");
        }
    }

    private StoredFileInfo storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Please select a valid certificate file to upload.", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ApiException("File size exceeds maximum permitted limit of 10 MB.", HttpStatus.BAD_REQUEST);
        }

        String rawOriginalFilename = file.getOriginalFilename();
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(rawOriginalFilename, "certificate"));
        if (originalFilename.contains("..")) {
            throw new ApiException("Invalid filename contains relative path sequence.", HttpStatus.BAD_REQUEST);
        }

        // Validate Extension
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!EXTENSION_MIME_MAP.containsKey(extension)) {
            throw new ApiException("Unsupported file format (." + extension + "). Please upload PDF, JPG, JPEG, PNG, or WebP.", HttpStatus.BAD_REQUEST);
        }

        // Validate MIME type
        String expectedMimeType = EXTENSION_MIME_MAP.get(extension);
        String clientContentType = file.getContentType();
        if (clientContentType != null && !clientContentType.equalsIgnoreCase("application/octet-stream")) {
            if (!isMimeTypeMatching(extension, clientContentType)) {
                log.warn("MIME type mismatch for file '{}': client provided '{}', expected '{}'", originalFilename, clientContentType, expectedMimeType);
            }
        }

        // Validate Magic Bytes / File Signatures
        validateFileSignature(file, extension);

        try {
            String safeStorageName = "certificate_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + extension;
            Path targetLocation = this.storageLocation.resolve(safeStorageName).normalize();

            // Safety check against path traversal
            if (!targetLocation.startsWith(this.storageLocation)) {
                throw new ApiException("Cannot store file outside current storage directory.", HttpStatus.BAD_REQUEST);
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return new StoredFileInfo(safeStorageName, originalFilename, expectedMimeType, file.getSize(), targetLocation.toString());
        } catch (IOException e) {
            log.error("Failed to store certificate file: {}", e.getMessage());
            throw new ApiException("Failed to save certificate file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void deletePhysicalFile(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) return;
        try {
            Path filePath = Paths.get(storagePath).normalize();
            if (filePath.startsWith(this.storageLocation)) {
                Files.deleteIfExists(filePath);
                log.debug("Deleted physical certificate file: {}", filePath);
            }
        } catch (IOException e) {
            log.warn("Could not delete physical certificate file '{}': {}", storagePath, e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }

    private boolean isMimeTypeMatching(String extension, String mimeType) {
        String lowerMime = mimeType.toLowerCase();
        return switch (extension) {
            case "pdf" -> lowerMime.contains("pdf");
            case "jpg", "jpeg" -> lowerMime.contains("jpeg") || lowerMime.contains("jpg") || lowerMime.contains("pjpeg");
            case "png" -> lowerMime.contains("png");
            case "webp" -> lowerMime.contains("webp");
            default -> false;
        };
    }

    private void validateFileSignature(MultipartFile file, String extension) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int read = is.read(header);
            if (read < 4) {
                throw new ApiException("Uploaded file is corrupted or empty.", HttpStatus.BAD_REQUEST);
            }

            switch (extension) {
                case "pdf" -> {
                    // %PDF- (0x25, 0x50, 0x44, 0x46)
                    if (header[0] != 0x25 || header[1] != 0x50 || header[2] != 0x44 || header[3] != 0x46) {
                        throw new ApiException("Invalid PDF file structure.", HttpStatus.BAD_REQUEST);
                    }
                }
                case "jpg", "jpeg" -> {
                    // 0xFF, 0xD8, 0xFF
                    if ((header[0] & 0xFF) != 0xFF || (header[1] & 0xFF) != 0xD8 || (header[2] & 0xFF) != 0xFF) {
                        throw new ApiException("Invalid JPEG image structure.", HttpStatus.BAD_REQUEST);
                    }
                }
                case "png" -> {
                    // 0x89, 0x50, 0x4E, 0x47
                    if ((header[0] & 0xFF) != 0x89 || (header[1] & 0xFF) != 0x50 || (header[2] & 0xFF) != 0x4E || (header[3] & 0xFF) != 0x47) {
                        throw new ApiException("Invalid PNG image structure.", HttpStatus.BAD_REQUEST);
                    }
                }
                case "webp" -> {
                    // RIFF....WEBP (0x52, 0x49, 0x46, 0x46 ... 0x57, 0x45, 0x42, 0x50)
                    if (header[0] != 0x52 || header[1] != 0x49 || header[2] != 0x46 || header[3] != 0x46 ||
                            read < 12 || header[8] != 0x57 || header[9] != 0x45 || header[10] != 0x42 || header[11] != 0x50) {
                        throw new ApiException("Invalid WebP image structure.", HttpStatus.BAD_REQUEST);
                    }
                }
            }
        } catch (IOException e) {
            log.warn("Could not inspect file signature: {}", e.getMessage());
        }
    }

    public record StoredFileInfo(String safeStorageName, String originalFileName, String contentType, Long fileSize, String storagePath) {}
    public record ResourceAndMetadata(Resource resource, String contentType, String originalFilename) {}
}
