package com.deva.portfolio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutContentRequest {

    @NotBlank(message = "Badge is required")
    private String badge;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Career summary is required")
    private String careerSummary;

    @NotBlank(message = "Experience summary is required")
    private String experienceSummary;

    @Valid
    @Builder.Default
    private List<AboutCapabilityRequest> capabilities = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<AboutEducationRequest> education = new ArrayList<>();

    @Valid
    private AboutRoleRequest currentRole;
}
