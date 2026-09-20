package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutEducationRequest {

    private Long id;

    @NotBlank(message = "Degree name is required")
    private String degree;

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotBlank(message = "Start year is required")
    private String startYear;

    private String endYear;

    private String cgpa;

    private String highlight;

    private Integer displayOrder;

    @Builder.Default
    private Boolean visible = true;
}
