package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Consolidated DTO containing the complete public portfolio data in a single response bundle.
 * Designed for blazing-fast initial page loads and reducing frontend roundtrips from 13 down to 1.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioBundleResponse {

    private HeaderConfigResponse header;

    private HeroContentResponse hero;

    private AboutContentResponse about;

    private SectionHeaderResponse skillsHeader;

    @Builder.Default
    private List<SkillGroupResponse> groupedSkills = new ArrayList<>();

    @Builder.Default
    private List<SkillResponse> skills = new ArrayList<>();

    private SectionHeaderResponse experienceHeader;

    @Builder.Default
    private List<ExperienceResponse> experience = new ArrayList<>();

    private SectionHeaderResponse projectsHeader;

    @Builder.Default
    private List<ProjectResponse> projects = new ArrayList<>();

    private SectionHeaderResponse certificationsHeader;

    @Builder.Default
    private List<CertificationResponse> certifications = new ArrayList<>();

    private ContactSettingsResponse contact;
}
