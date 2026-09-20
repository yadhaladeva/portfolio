package com.deva.portfolio.dto.response;

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
public class AboutContentResponse {

    private Long id;
    private String badge;
    private String title;
    private String careerSummary;
    private String experienceSummary;

    @Builder.Default
    private List<AboutCapabilityResponse> capabilities = new ArrayList<>();

    @Builder.Default
    private List<AboutEducationResponse> education = new ArrayList<>();

    private AboutRoleResponse currentRole;
}
