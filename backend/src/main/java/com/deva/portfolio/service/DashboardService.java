package com.deva.portfolio.service;

import com.deva.portfolio.dto.response.DashboardStatsResponse;
import com.deva.portfolio.entity.Skill;
import com.deva.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificationRepository certificationRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalProjects = projectRepository.count();
        long totalSkills = skillRepository.count();
        long totalExperience = experienceRepository.count();
        long totalCertifications = certificationRepository.count();
        long unreadMessages = contactMessageRepository.countByStatus("UNREAD");
        long totalMessages = contactMessageRepository.count();

        Map<String, Long> skillsByCategory = skillRepository.findAll().stream()
                .collect(Collectors.groupingBy(Skill::getCategory, Collectors.counting()));

        return DashboardStatsResponse.builder()
                .totalProjects(totalProjects)
                .totalSkills(totalSkills)
                .totalExperience(totalExperience)
                .totalCertifications(totalCertifications)
                .unreadMessages(unreadMessages)
                .totalMessages(totalMessages)
                .skillsByCategory(skillsByCategory)
                .build();
    }
}
