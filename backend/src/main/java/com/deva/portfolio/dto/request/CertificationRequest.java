package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating and updating certifications.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationRequest {

    @NotBlank(message = "Certification name is required")
    private String name;

    @NotBlank(message = "Issuer organization is required")
    private String issuer;

    private String issuedDate;
    private String credentialUrl;

    @Builder.Default
    private Integer displayOrder = 0;

    private Boolean removeCertificate;
}
