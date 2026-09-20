package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.AboutCapabilityRequest;
import com.deva.portfolio.dto.request.AboutContentRequest;
import com.deva.portfolio.dto.request.AboutEducationRequest;
import com.deva.portfolio.dto.request.AboutRoleRequest;
import com.deva.portfolio.dto.response.AboutCapabilityResponse;
import com.deva.portfolio.dto.response.AboutContentResponse;
import com.deva.portfolio.dto.response.AboutEducationResponse;
import com.deva.portfolio.dto.response.AboutRoleResponse;
import com.deva.portfolio.entity.AboutCapability;
import com.deva.portfolio.entity.AboutContent;
import com.deva.portfolio.entity.AboutEducation;
import com.deva.portfolio.entity.AboutRole;
import com.deva.portfolio.repository.AboutContentRepository;
import com.deva.portfolio.repository.AboutRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AboutService {

    private final AboutContentRepository aboutContentRepository;
    private final AboutRoleRepository aboutRoleRepository;

    @Transactional(readOnly = true)
    public AboutContentResponse getAboutContent(boolean publicOnly) {
        AboutContent content = aboutContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultAboutContent);
        return mapToResponse(content, publicOnly);
    }

    @Transactional
    public AboutContentResponse updateAboutContent(AboutContentRequest request) {
        AboutContent content = aboutContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultAboutContent);

        content.setBadge(request.getBadge() != null ? request.getBadge().trim() : "ABOUT ME");
        content.setTitle(request.getTitle() != null ? request.getTitle().trim() : "Career-Focused Summary");
        content.setCareerSummary(request.getCareerSummary() != null ? request.getCareerSummary().trim() : "");
        content.setExperienceSummary(request.getExperienceSummary() != null ? request.getExperienceSummary().trim() : "");

        // 1. Sync Capability Cards
        content.clearCapabilities();
        if (request.getCapabilities() != null && !request.getCapabilities().isEmpty()) {
            int order = 1;
            for (AboutCapabilityRequest capReq : request.getCapabilities()) {
                AboutCapability cap = AboutCapability.builder()
                        .title(capReq.getTitle() != null ? capReq.getTitle().trim() : "")
                        .description(capReq.getDescription() != null ? capReq.getDescription().trim() : "")
                        .icon(capReq.getIcon() != null && !capReq.getIcon().isBlank() ? capReq.getIcon().trim() : "Server")
                        .accent(capReq.getAccent() != null && !capReq.getAccent().isBlank() ? capReq.getAccent().trim() : "emerald")
                        .displayOrder(capReq.getDisplayOrder() != null ? capReq.getDisplayOrder() : order)
                        .visible(capReq.getVisible() != null ? capReq.getVisible() : true)
                        .build();

                content.addCapability(cap);
                order++;
            }
        }

        // 2. Sync Dynamic Education Entries (Multiple entries supported)
        content.clearEducation();
        if (request.getEducation() != null && !request.getEducation().isEmpty()) {
            int order = 1;
            for (AboutEducationRequest eduReq : request.getEducation()) {
                AboutEducation edu = AboutEducation.builder()
                        .degree(eduReq.getDegree() != null ? eduReq.getDegree().trim() : "")
                        .institution(eduReq.getInstitution() != null ? eduReq.getInstitution().trim() : "")
                        .startYear(eduReq.getStartYear() != null ? eduReq.getStartYear().trim() : "")
                        .endYear(eduReq.getEndYear() != null ? eduReq.getEndYear().trim() : "")
                        .cgpa(eduReq.getCgpa() != null ? eduReq.getCgpa().trim() : "")
                        .highlight(eduReq.getHighlight() != null ? eduReq.getHighlight().trim() : "")
                        .displayOrder(eduReq.getDisplayOrder() != null ? eduReq.getDisplayOrder() : order)
                        .visible(eduReq.getVisible() != null ? eduReq.getVisible() : true)
                        .build();

                content.addEducation(edu);
                order++;
            }
        }

        // 3. Sync Current Role
        if (request.getCurrentRole() != null) {
            AboutRoleRequest roleReq = request.getCurrentRole();
            AboutRole role = content.getCurrentRole();
            if (role == null) {
                role = AboutRole.builder().aboutContent(content).build();
            }
            role.setRoleTitle(roleReq.getRoleTitle() != null ? roleReq.getRoleTitle().trim() : "Graduate Engineer Trainee");
            role.setCompany(roleReq.getCompany() != null ? roleReq.getCompany().trim() : "HCLTech");
            role.setLocation(roleReq.getLocation() != null ? roleReq.getLocation().trim() : "Chennai, India");
            role.setStartDate(roleReq.getStartDate() != null ? roleReq.getStartDate().trim() : "Jan 2026");
            role.setEndDate(roleReq.getEndDate() != null ? roleReq.getEndDate().trim() : "Present");
            role.setCurrent(roleReq.getCurrent() != null ? roleReq.getCurrent() : true);
            content.setCurrentRole(role);
        }

        AboutContent saved = aboutContentRepository.save(content);
        log.info("About section content updated successfully ({} capability cards, {} education entries).",
                saved.getCapabilities().size(), saved.getEducation().size());
        return mapToResponse(saved, false);
    }

    @Transactional
    public AboutContentResponse resetToDefaults() {
        AboutContent content = aboutContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultAboutContent);

        content.setBadge("ABOUT ME");
        content.setTitle("Career-Focused Summary");
        content.setCareerSummary("I am a dedicated Software Developer with a robust foundation in computer science and modern software design principles. My technical focus revolves around enterprise Java development, Spring Boot microservices, relational database modeling in PostgreSQL, and building performant end-to-end full-stack systems.");
        content.setExperienceSummary("With experience spanning across HCLTech as a Graduate Engineer Trainee, BISAG-N as a Young Professional, and an internship at Infosys Limited, I have contributed to production-grade software lifecycles, backend APIs, data pipelines, and analytics tooling.");

        content.clearCapabilities();
        content.addCapability(AboutCapability.builder()
                .title("Backend Systems")
                .description("Java, Spring Boot, REST APIs, Security")
                .icon("Server")
                .accent("emerald")
                .displayOrder(1)
                .visible(true)
                .build());

        content.addCapability(AboutCapability.builder()
                .title("Data Architecture")
                .description("PostgreSQL, SQL, Hibernate JPA")
                .icon("Database")
                .accent("cyan")
                .displayOrder(2)
                .visible(true)
                .build());

        content.addCapability(AboutCapability.builder()
                .title("Full-Stack Tech")
                .description("React, HTML, CSS, JavaScript")
                .icon("Code2")
                .accent("purple")
                .displayOrder(3)
                .visible(true)
                .build());

        content.clearEducation();
        content.addEducation(AboutEducation.builder()
                .degree("B.Tech in Computer Science and Business Systems")
                .institution("Sagi Rama Krishnam Raju Engineering College")
                .startYear("2021")
                .endYear("2025")
                .cgpa("8.64")
                .highlight("Academic Distinction")
                .displayOrder(1)
                .visible(true)
                .build());

        AboutRole role = content.getCurrentRole();
        if (role == null) {
            role = AboutRole.builder().aboutContent(content).build();
        }
        role.setRoleTitle("Graduate Engineer Trainee");
        role.setCompany("HCLTech");
        role.setLocation("Chennai, India");
        role.setStartDate("Jan 2026");
        role.setEndDate("Present");
        role.setCurrent(true);
        content.setCurrentRole(role);

        AboutContent saved = aboutContentRepository.save(content);
        log.info("About section content reset to canonical defaults.");
        return mapToResponse(saved, false);
    }

    @Transactional
    public AboutContent createDefaultAboutContent() {
        AboutContent content = AboutContent.builder()
                .badge("ABOUT ME")
                .title("Career-Focused Summary")
                .careerSummary("I am a dedicated Software Developer with a robust foundation in computer science and modern software design principles. My technical focus revolves around enterprise Java development, Spring Boot microservices, relational database modeling in PostgreSQL, and building performant end-to-end full-stack systems.")
                .experienceSummary("With experience spanning across HCLTech as a Graduate Engineer Trainee, BISAG-N as a Young Professional, and an internship at Infosys Limited, I have contributed to production-grade software lifecycles, backend APIs, data pipelines, and analytics tooling.")
                .build();

        content.addCapability(AboutCapability.builder()
                .title("Backend Systems")
                .description("Java, Spring Boot, REST APIs, Security")
                .icon("Server")
                .accent("emerald")
                .displayOrder(1)
                .visible(true)
                .build());

        content.addCapability(AboutCapability.builder()
                .title("Data Architecture")
                .description("PostgreSQL, SQL, Hibernate JPA")
                .icon("Database")
                .accent("cyan")
                .displayOrder(2)
                .visible(true)
                .build());

        content.addCapability(AboutCapability.builder()
                .title("Full-Stack Tech")
                .description("React, HTML, CSS, JavaScript")
                .icon("Code2")
                .accent("purple")
                .displayOrder(3)
                .visible(true)
                .build());

        content.addEducation(AboutEducation.builder()
                .degree("B.Tech in Computer Science and Business Systems")
                .institution("Sagi Rama Krishnam Raju Engineering College")
                .startYear("2021")
                .endYear("2025")
                .cgpa("8.64")
                .highlight("Academic Distinction")
                .displayOrder(1)
                .visible(true)
                .build());

        AboutRole role = AboutRole.builder()
                .roleTitle("Graduate Engineer Trainee")
                .company("HCLTech")
                .location("Chennai, India")
                .startDate("Jan 2026")
                .endDate("Present")
                .current(true)
                .build();

        content.setCurrentRole(role);
        return aboutContentRepository.save(content);
    }

    private AboutContentResponse mapToResponse(AboutContent entity, boolean publicOnly) {
        if (entity == null) {
            return null;
        }

        List<AboutCapabilityResponse> capResponses = new ArrayList<>();
        if (entity.getCapabilities() != null) {
            capResponses = entity.getCapabilities().stream()
                    .filter(c -> !publicOnly || Boolean.TRUE.equals(c.getVisible()))
                    .sorted(Comparator.comparing(AboutCapability::getDisplayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .map(c -> AboutCapabilityResponse.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .description(c.getDescription())
                            .icon(c.getIcon())
                            .accent(c.getAccent())
                            .displayOrder(c.getDisplayOrder())
                            .visible(c.getVisible())
                            .build())
                    .collect(Collectors.toList());
        }

        List<AboutEducationResponse> eduResponses = new ArrayList<>();
        if (entity.getEducation() != null) {
            eduResponses = entity.getEducation().stream()
                    .filter(e -> !publicOnly || Boolean.TRUE.equals(e.getVisible()))
                    .sorted(Comparator.comparing(AboutEducation::getDisplayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .map(e -> AboutEducationResponse.builder()
                            .id(e.getId())
                            .degree(e.getDegree())
                            .institution(e.getInstitution())
                            .startYear(e.getStartYear())
                            .endYear(e.getEndYear())
                            .cgpa(e.getCgpa())
                            .highlight(e.getHighlight())
                            .displayOrder(e.getDisplayOrder())
                            .visible(e.getVisible())
                            .build())
                    .collect(Collectors.toList());
        }

        AboutRoleResponse roleResponse = null;
        if (entity.getCurrentRole() != null) {
            AboutRole role = entity.getCurrentRole();
            roleResponse = AboutRoleResponse.builder()
                    .id(role.getId())
                    .roleTitle(role.getRoleTitle())
                    .company(role.getCompany())
                    .location(role.getLocation())
                    .startDate(role.getStartDate())
                    .endDate(role.getEndDate())
                    .current(role.getCurrent())
                    .build();
        }

        return AboutContentResponse.builder()
                .id(entity.getId())
                .badge(entity.getBadge())
                .title(entity.getTitle())
                .careerSummary(entity.getCareerSummary())
                .experienceSummary(entity.getExperienceSummary())
                .capabilities(capResponses)
                .education(eduResponses)
                .currentRole(roleResponse)
                .build();
    }
}
