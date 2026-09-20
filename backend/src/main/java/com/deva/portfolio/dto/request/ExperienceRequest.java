package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating and updating career experience / internships.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceRequest {

    @NotBlank(message = "Organization / Company name is required")
    private String organization;

    @NotBlank(message = "Job role / title is required")
    private String role;

    private String location;

    @NotBlank(message = "Start date is required")
    private String startDate;

    private String endDate; // e.g. "Present" or "Dec 2025"

    @NotBlank(message = "Role description is required")
    private String description;

    @Builder.Default
    private Integer displayOrder = 0;
}
