package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.ProjectRequest;
import com.deva.portfolio.dto.response.ProjectResponse;
import com.deva.portfolio.entity.Project;
import com.deva.portfolio.entity.Technology;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.ProjectRepository;
import com.deva.portfolio.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(ProjectResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return ProjectResponse.fromEntity(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Set<Technology> resolvedTechnologies = resolveTechnologies(request.getTechnologies());

        Project project = Project.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .technologies(resolvedTechnologies)
                .features(request.getFeatures() != null ? new java.util.ArrayList<>(request.getFeatures()) : new java.util.ArrayList<>())
                .githubUrl(request.getGithubUrl())
                .demoUrl(request.getDemoUrl())
                .imageUrl(request.getImageUrl())
                .tableauUrl(request.getTableauUrl())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        Project saved = projectRepository.save(project);
        return ProjectResponse.fromEntity(saved);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        Set<Technology> resolvedTechnologies = resolveTechnologies(request.getTechnologies());

        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription().trim());
        project.setTechnologies(resolvedTechnologies);
        if (request.getFeatures() != null) {
            project.getFeatures().clear();
            project.getFeatures().addAll(request.getFeatures());
        }
        project.setGithubUrl(request.getGithubUrl());
        project.setDemoUrl(request.getDemoUrl());
        project.setImageUrl(request.getImageUrl());
        project.setTableauUrl(request.getTableauUrl());
        if (request.getFeatured() != null) {
            project.setFeatured(request.getFeatured());
        }
        if (request.getDisplayOrder() != null) {
            project.setDisplayOrder(request.getDisplayOrder());
        }

        Project updated = projectRepository.save(project);
        return ProjectResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        projectRepository.delete(project);
    }

    /**
     * Resolves technology names to normalized Technology entities in the database.
     * Inserts any new technology names automatically into the technologies table.
     */
    private Set<Technology> resolveTechnologies(Set<String> techNames) {
        Set<Technology> result = new HashSet<>();
        if (techNames == null || techNames.isEmpty()) {
            return result;
        }

        for (String rawName : techNames) {
            if (rawName == null || rawName.trim().isEmpty()) continue;
            String name = rawName.trim();
            Technology tech = technologyRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> technologyRepository.save(Technology.builder().name(name).build()));
            result.add(tech);
        }
        return result;
    }
}
