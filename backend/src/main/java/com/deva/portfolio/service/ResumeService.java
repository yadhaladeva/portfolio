package com.deva.portfolio.service;

import com.deva.portfolio.dto.response.ResumeResponse;
import com.deva.portfolio.entity.Resume;
import com.deva.portfolio.exception.ApiException;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.ResumeRepository;
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
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Service managing Resume file storage, validation, metadata persistence, and stream downloads.
 */
@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);
    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    private final ResumeRepository resumeRepository;
    private final SupabaseStorageService supabaseStorageService;

    @Value("${resume.upload.dir:./data/uploads/resume}")
    private String uploadDir;

    private Path storageLocation;

    @PostConstruct
    public void init() {
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
            log.info("Resume local storage initialized at: {}", this.storageLocation);
        } catch (IOException e) {
            log.warn("Could not initialize resume local directory: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Optional<ResumeResponse> getActiveResume() {
        return resumeRepository.findFirstByActiveTrueOrderByUploadedAtDesc()
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Resume getActiveResumeEntity() {
        return resumeRepository.findFirstByActiveTrueOrderByUploadedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No active resume is currently available."));
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getAllResumes() {
        return resumeRepository.findAllByOrderByUploadedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Please select a valid non-empty PDF file to upload.", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ApiException("File size exceeds maximum permitted limit of 10 MB.", HttpStatus.BAD_REQUEST);
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "resume.pdf"));
        if (!originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new ApiException("Please upload a valid PDF resume (only .pdf files are accepted).", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.equalsIgnoreCase("application/pdf") && !contentType.equalsIgnoreCase("application/octet-stream")) {
            throw new ApiException("Invalid MIME type: Please upload a valid PDF file.", HttpStatus.BAD_REQUEST);
        }

        try {
            String safeStorageName = "resume_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ".pdf";
            byte[] fileBytes = file.getBytes();
            String storagePathValue;

            // 1. If Supabase Storage is configured, store persistently in Supabase
            if (supabaseStorageService.isConfigured()) {
                String bucket = supabaseStorageService.getResumesBucket();
                storagePathValue = supabaseStorageService.uploadFile(bucket, safeStorageName, fileBytes, "application/pdf");
                log.info("Resume uploaded to persistent Supabase Storage: {}", storagePathValue);
            } else {
                // 2. Local disk fallback
                Path targetLocation = this.storageLocation.resolve(safeStorageName);
                Files.write(targetLocation, fileBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                storagePathValue = targetLocation.toString();
            }

            // Deactivate existing active resumes
            List<Resume> activeResumes = resumeRepository.findAll().stream()
                    .filter(r -> Boolean.TRUE.equals(r.getActive()))
                    .toList();
            for (Resume r : activeResumes) {
                r.setActive(false);
            }
            if (!activeResumes.isEmpty()) {
                resumeRepository.saveAll(activeResumes);
            }

            // Create and persist new Resume
            Resume resume = Resume.builder()
                    .fileName(originalFilename)
                    .originalFileName(originalFilename)
                    .contentType("application/pdf")
                    .fileSize(file.getSize())
                    .storagePath(storagePathValue)
                    .active(true)
                    .build();

            Resume saved = resumeRepository.save(resume);
            log.info("Uploaded and activated new resume ID {} ('{}')", saved.getId(), saved.getFileName());

            return mapToResponse(saved);
        } catch (IOException e) {
            log.error("Failed to store resume file: {}", e.getMessage());
            throw new ApiException("Failed to upload resume file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Resource loadResumeResource(Resume resume) {
        // Check if stored in Supabase Cloud Storage
        if (SupabaseStorageService.isSupabaseStoragePath(resume.getStoragePath())) {
            String[] parsed = SupabaseStorageService.parseSupabaseUri(resume.getStoragePath());
            if (parsed != null && supabaseStorageService.isConfigured()) {
                byte[] bytes = supabaseStorageService.downloadFile(parsed[0], parsed[1]);
                return new org.springframework.core.io.ByteArrayResource(bytes) {
                    @Override
                    public String getFilename() {
                        return resume.getFileName() != null ? resume.getFileName() : "resume.pdf";
                    }
                };
            }
        }

        // Local storage fallback
        try {
            Path filePath = Paths.get(resume.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found: " + resume.getFileName());
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Resume file location is invalid.");
        }
    }

    @Transactional
    public void deleteResume(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume with ID " + id + " not found."));

        // Delete from Supabase Storage if URI
        if (SupabaseStorageService.isSupabaseStoragePath(resume.getStoragePath())) {
            String[] parsed = SupabaseStorageService.parseSupabaseUri(resume.getStoragePath());
            if (parsed != null && supabaseStorageService.isConfigured()) {
                supabaseStorageService.deleteFile(parsed[0], parsed[1]);
                log.info("Deleted resume from Supabase Storage: bucket='{}', path='{}'", parsed[0], parsed[1]);
            }
        } else {
            // Remove file from local disk
            try {
                Path filePath = Paths.get(resume.getStoragePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.warn("Could not delete resume local file: {}", e.getMessage());
            }
        }

        resumeRepository.delete(resume);
        log.info("Deleted resume ID {}", id);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .originalFileName(resume.getOriginalFileName())
                .contentType(resume.getContentType())
                .fileSize(resume.getFileSize())
                .formattedFileSize(ResumeResponse.formatBytes(resume.getFileSize()))
                .active(resume.getActive())
                .uploadedAt(resume.getUploadedAt())
                .updatedAt(resume.getUpdatedAt())
                .downloadUrl("/api/resume/download")
                .previewUrl("/api/resume/preview")
                .build();
    }
}
