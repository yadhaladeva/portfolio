package com.deva.portfolio.dto.response;

import com.deva.portfolio.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing an individual skill.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {
    private Long id;
    private String name;
    private String category;
    private Integer proficiency;
    private Integer displayOrder;

    public static SkillResponse fromEntity(Skill skill) {
        if (skill == null) return null;
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .proficiency(skill.getProficiency())
                .displayOrder(skill.getDisplayOrder())
                .build();
    }
}
