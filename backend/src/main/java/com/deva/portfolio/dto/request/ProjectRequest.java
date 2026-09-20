package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * DTO for creating and updating portfolio projects.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    private String title;

    @NotBlank(message = "Project description is required")
    private String description;

    @Builder.Default
    private Set<String> technologies = new HashSet<>();

    private String githubUrl;
    private String demoUrl;
    private String imageUrl;
    private String tableauUrl;

    @Builder.Default
    private Boolean featured = false;

    @Builder.Default
    private Integer displayOrder = 0;
}
