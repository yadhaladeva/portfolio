package com.deva.portfolio.dto.response;

import com.deva.portfolio.entity.Project;
import com.deva.portfolio.entity.Technology;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO representing a portfolio project for public display and admin management.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> technologies;
    private String githubUrl;
    private String demoUrl;
    private String imageUrl;
    private String tableauUrl;
    private Boolean featured;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectResponse fromEntity(Project project) {
        if (project == null) return null;

        List<String> techNames = project.getTechnologies() != null
                ? project.getTechnologies().stream()
                .map(Technology::getName)
                .sorted()
                .collect(Collectors.toList())
                : List.of();

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologies(techNames)
                .githubUrl(project.getGithubUrl())
                .demoUrl(project.getDemoUrl())
                .imageUrl(project.getImageUrl())
                .tableauUrl(project.getTableauUrl())
                .featured(project.getFeatured())
                .displayOrder(project.getDisplayOrder())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
