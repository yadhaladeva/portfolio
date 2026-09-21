package com.deva.portfolio.controller;

import com.deva.portfolio.dto.response.*;
import com.deva.portfolio.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public REST Controller serving read-only portfolio content for visitors and recruiters.
 * High-performance, fast response times, accessible without authentication.
 */
@Tag(name = "2. Public Portfolio Content", description = "Public read-only endpoints for projects, skills, career experience, and certifications")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicPortfolioController {

    private final HeaderService headerService;
    private final HeroService heroService;
    private final AboutService aboutService;
    private final ProjectService projectService;
    private final SkillService skillService;
    private final ExperienceService experienceService;
    private final CertificationService certificationService;
    private final SectionHeaderService sectionHeaderService;
    private final ContactSettingsService contactSettingsService;

    @Operation(summary = "Get Full Public Portfolio Bundle", description = "Fetches the entire public portfolio data (Header, Hero, About, Skills, Experience, Projects, Certifications, Contact) in a single consolidated JSON response.")
    @GetMapping({"/public/portfolio", "/portfolio/bundle"})
    public ResponseEntity<ApiResponse<PortfolioBundleResponse>> getPublicPortfolio() {
        PortfolioBundleResponse bundle = PortfolioBundleResponse.builder()
                .header(headerService.getHeaderConfig())
                .hero(heroService.getHeroContent())
                .about(aboutService.getAboutContent(true))
                .skillsHeader(sectionHeaderService.getHeader("SKILLS"))
                .groupedSkills(skillService.getSkillsGroupedByCategory())
                .skills(skillService.getAllSkills())
                .experienceHeader(sectionHeaderService.getHeader("EXPERIENCE"))
                .experience(experienceService.getAllExperience())
                .projectsHeader(sectionHeaderService.getHeader("PROJECTS"))
                .projects(projectService.getAllProjects())
                .certificationsHeader(sectionHeaderService.getHeader("CERTIFICATIONS"))
                .certifications(certificationService.getAllCertifications())
                .contact(contactSettingsService.getContactSettings())
                .build();

        return ResponseEntity.ok(ApiResponse.success(bundle));
    }

    @Operation(summary = "Get Section Header by Key", description = "Fetches published badge text and description for a specific section (SKILLS, EXPERIENCE, PROJECTS, CERTIFICATIONS).")
    @GetMapping({"/skills/header", "/experience/header", "/projects/header", "/certifications/header", "/section-header/{sectionKey}"})
    public ResponseEntity<ApiResponse<SectionHeaderResponse>> getSectionHeader(
            @PathVariable(required = false) String sectionKey,
            jakarta.servlet.http.HttpServletRequest request) {
        String key = sectionKey;
        if (key == null) {
            String uri = request.getRequestURI();
            if (uri.contains("/skills")) key = "SKILLS";
            else if (uri.contains("/experience")) key = "EXPERIENCE";
            else if (uri.contains("/projects")) key = "PROJECTS";
            else if (uri.contains("/certifications")) key = "CERTIFICATIONS";
            else key = "SKILLS";
        }
        return ResponseEntity.ok(ApiResponse.success(sectionHeaderService.getHeader(key)));
    }

    @Operation(summary = "Get All Projects", description = "Fetches list of portfolio showcase projects sorted by display order.")
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getAllProjects()));
    }

    @Operation(summary = "Get Project by ID", description = "Fetches detailed information for a specific project.")
    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectById(id)));
    }

    @Operation(summary = "Get All Skills", description = "Fetches all skills with proficiency ratings and display ordering.")
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAllSkills()));
    }

    @Operation(summary = "Get Grouped Skills", description = "Fetches skills grouped into categorized sets (Programming, Framework, Database, Web, Tools, Soft skills).")
    @GetMapping("/skills/grouped")
    public ResponseEntity<ApiResponse<List<SkillGroupResponse>>> getGroupedSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getSkillsGroupedByCategory()));
    }

    @Operation(summary = "Get Career Experience", description = "Fetches work history (HCLTech, BISAG-N, Infosys) in chronological order.")
    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getExperience() {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAllExperience()));
    }

    @Operation(summary = "Get Certifications", description = "Fetches verified certifications and credentials.")
    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getCertifications() {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getAllCertifications()));
    }

    @Operation(summary = "View Certificate File Inline", description = "Streams the verified certificate file inline (PDF or Image) for in-browser inspection.")
    @GetMapping("/certifications/{id}/certificate")
    public ResponseEntity<org.springframework.core.io.Resource> getCertificate(@PathVariable Long id) {
        CertificationService.ResourceAndMetadata data = certificationService.loadCertificateResource(id);
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(data.contentType()))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + data.originalFilename() + "\"")
                .header(org.springframework.http.HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(data.resource());
    }
}
