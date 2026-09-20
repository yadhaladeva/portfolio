package com.deva.portfolio.dto.response;

import com.deva.portfolio.entity.Certification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing a verified certification entry with optional certificate metadata.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationResponse {
    private Long id;
    private String name;
    private String issuer;
    private String issuedDate;
    private String credentialUrl;
    private Integer displayOrder;

    // Certificate metadata
    private Boolean hasCertificate;
    private String fileName;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private String formattedFileSize;
    private String certificateUrl;
    private LocalDateTime uploadedAt;

    public static CertificationResponse fromEntity(Certification cert) {
        if (cert == null) return null;
        boolean hasCert = cert.getStoragePath() != null && !cert.getStoragePath().isBlank();

        return CertificationResponse.builder()
                .id(cert.getId())
                .name(cert.getName())
                .issuer(cert.getIssuer())
                .issuedDate(cert.getIssuedDate())
                .credentialUrl(cert.getCredentialUrl())
                .displayOrder(cert.getDisplayOrder())
                .hasCertificate(hasCert)
                .fileName(cert.getFileName())
                .originalFileName(cert.getOriginalFileName())
                .contentType(cert.getContentType())
                .fileSize(cert.getFileSize())
                .formattedFileSize(hasCert && cert.getFileSize() != null ? formatBytes(cert.getFileSize()) : null)
                .certificateUrl(hasCert ? "/api/certifications/" + cert.getId() + "/certificate" : null)
                .uploadedAt(cert.getUploadedAt())
                .build();
    }

    public static String formatBytes(Long bytes) {
        if (bytes == null || bytes <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        digitGroups = Math.min(digitGroups, units.length - 1);
        return String.format("%.1f %s", bytes / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
