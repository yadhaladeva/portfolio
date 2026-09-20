package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating and updating skills.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    private String name;

    @NotBlank(message = "Category is required (e.g., Programming, Framework, Web, Database, Tools, Soft skills)")
    private String category;

    @Min(value = 1, message = "Proficiency must be at least 1")
    @Max(value = 100, message = "Proficiency cannot exceed 100")
    @Builder.Default
    private Integer proficiency = 85;

    @Builder.Default
    private Integer displayOrder = 0;
}
