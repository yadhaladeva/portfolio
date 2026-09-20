package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.SectionHeaderRequest;
import com.deva.portfolio.dto.response.SectionHeaderResponse;
import com.deva.portfolio.entity.SectionHeaderConfig;
import com.deva.portfolio.repository.SectionHeaderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SectionHeaderService {

    private final SectionHeaderRepository sectionHeaderRepository;

    private static final Map<String, SectionHeaderDefaults> CANONICAL_DEFAULTS = Map.of(
            "SKILLS", new SectionHeaderDefaults(
                    "SKILLS",
                    "Categorized technical capabilities, frameworks, and engineering tools verified through projects and professional experience."
            ),
            "EXPERIENCE", new SectionHeaderDefaults(
                    "EXPERIENCE",
                    "Practical software engineering and technical roles across enterprise and engineering organizations."
            ),
            "PROJECTS", new SectionHeaderDefaults(
                    "PROJECTS",
                    "Practical software projects showcasing Java & Spring Boot backend services, relational database schemas, document processing, and data analytics."
            ),
            "CERTIFICATIONS", new SectionHeaderDefaults(
                    "CERTIFICATIONS",
                    "Professional certifications and assessments validating expertise in Java, Full Stack Development, Python, and SQL."
            ),
            "CONTACT", new SectionHeaderDefaults(
                    "GET IN TOUCH",
                    "Open to software engineering, backend development, and technical collaboration opportunities."
            )
    );

    @Transactional
    public SectionHeaderConfig getOrCreateSectionHeader(String sectionKey) {
        String normalizedKey = sectionKey.trim().toUpperCase();
        SectionHeaderDefaults defaults = CANONICAL_DEFAULTS.getOrDefault(
                normalizedKey,
                new SectionHeaderDefaults(normalizedKey, "Portfolio Section Content")
        );

        return sectionHeaderRepository.findBySectionKeyIgnoreCase(normalizedKey)
                .orElseGet(() -> {
                    log.info("Seeding default SectionHeaderConfig for key: {}", normalizedKey);
                    SectionHeaderConfig config = SectionHeaderConfig.builder()
                            .sectionKey(normalizedKey)
                            .badgeText(defaults.badgeText)
                            .description(defaults.description)
                            .build();
                    return sectionHeaderRepository.save(config);
                });
    }

    @Transactional(readOnly = true)
    public SectionHeaderResponse getHeader(String sectionKey) {
        String normalizedKey = sectionKey.trim().toUpperCase();
        SectionHeaderDefaults defaults = CANONICAL_DEFAULTS.getOrDefault(
                normalizedKey,
                new SectionHeaderDefaults(normalizedKey, "Portfolio Section Content")
        );

        SectionHeaderConfig config = sectionHeaderRepository.findBySectionKeyIgnoreCase(normalizedKey)
                .orElse(SectionHeaderConfig.builder()
                        .sectionKey(normalizedKey)
                        .badgeText(defaults.badgeText)
                        .description(defaults.description)
                        .build());

        return SectionHeaderResponse.builder()
                .sectionKey(config.getSectionKey())
                .badgeText(config.getBadgeText())
                .description(config.getDescription())
                .updatedAt(config.getUpdatedAt())
                .build();
    }

    @Transactional
    public SectionHeaderResponse updateHeader(String sectionKey, SectionHeaderRequest request) {
        String normalizedKey = sectionKey.trim().toUpperCase();
        SectionHeaderConfig config = getOrCreateSectionHeader(normalizedKey);

        config.setBadgeText(request.getBadgeText().trim());
        config.setDescription(request.getDescription().trim());

        SectionHeaderConfig saved = sectionHeaderRepository.save(config);
        log.info("Section header updated for key: {}", normalizedKey);

        return SectionHeaderResponse.builder()
                .sectionKey(saved.getSectionKey())
                .badgeText(saved.getBadgeText())
                .description(saved.getDescription())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Transactional
    public SectionHeaderResponse resetHeader(String sectionKey) {
        String normalizedKey = sectionKey.trim().toUpperCase();
        SectionHeaderDefaults defaults = CANONICAL_DEFAULTS.getOrDefault(
                normalizedKey,
                new SectionHeaderDefaults(normalizedKey, "Portfolio Section Content")
        );

        SectionHeaderConfig config = getOrCreateSectionHeader(normalizedKey);
        config.setBadgeText(defaults.badgeText);
        config.setDescription(defaults.description);

        SectionHeaderConfig saved = sectionHeaderRepository.save(config);
        log.info("Section header reset to canonical defaults for key: {}", normalizedKey);

        return SectionHeaderResponse.builder()
                .sectionKey(saved.getSectionKey())
                .badgeText(saved.getBadgeText())
                .description(saved.getDescription())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    private record SectionHeaderDefaults(String badgeText, String description) {}
}
