package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.ExperienceRequest;
import com.deva.portfolio.dto.response.ExperienceResponse;
import com.deva.portfolio.entity.Experience;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Transactional(readOnly = true)
    public List<ExperienceResponse> getAllExperience() {
        return experienceRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(ExperienceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExperienceResponse getExperienceById(Long id) {
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        return ExperienceResponse.fromEntity(exp);
    }

    @Transactional
    public ExperienceResponse createExperience(ExperienceRequest request) {
        Experience exp = Experience.builder()
                .organization(request.getOrganization().trim())
                .role(request.getRole().trim())
                .location(request.getLocation() != null ? request.getLocation().trim() : null)
                .startDate(request.getStartDate().trim())
                .endDate(request.getEndDate() != null ? request.getEndDate().trim() : null)
                .description(request.getDescription().trim())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        Experience saved = experienceRepository.save(exp);
        return ExperienceResponse.fromEntity(saved);
    }

    @Transactional
    public ExperienceResponse updateExperience(Long id, ExperienceRequest request) {
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        exp.setOrganization(request.getOrganization().trim());
        exp.setRole(request.getRole().trim());
        exp.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        exp.setStartDate(request.getStartDate().trim());
        exp.setEndDate(request.getEndDate() != null ? request.getEndDate().trim() : null);
        exp.setDescription(request.getDescription().trim());
        if (request.getDisplayOrder() != null) {
            exp.setDisplayOrder(request.getDisplayOrder());
        }

        Experience updated = experienceRepository.save(exp);
        return ExperienceResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteExperience(Long id) {
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        experienceRepository.delete(exp);
    }
}
