package com.deva.portfolio.dto.response;

import com.deva.portfolio.entity.Experience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing an experience or internship entry.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceResponse {
    private Long id;
    private String organization;
    private String role;
    private String location;
    private String startDate;
    private String endDate;
    private String description;
    private Integer displayOrder;

    public static ExperienceResponse fromEntity(Experience exp) {
        if (exp == null) return null;
        return ExperienceResponse.builder()
                .id(exp.getId())
                .organization(exp.getOrganization())
                .role(exp.getRole())
                .location(exp.getLocation())
                .startDate(exp.getStartDate())
                .endDate(exp.getEndDate())
                .description(exp.getDescription())
                .displayOrder(exp.getDisplayOrder())
                .build();
    }
}
