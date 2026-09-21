package com.deva.portfolio.config;

import com.deva.portfolio.entity.*;
import com.deva.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

/**
 * DataInitializer seeds the database on initial startup if tables are empty.
 * - Seeds the admin account using environment variables (only if password provided).
 * - Seeds resume-verified profile content (Skills, Experience, Projects, Certifications).
 * - Auto-detects and activates existing uploaded resume PDF on disk if table is unseeded.
 * - Passwords are always hashed with BCrypt.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminUserRepository adminUserRepository;
    private final ProjectRepository projectRepository;
    private final TechnologyRepository technologyRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final CertificationRepository certificationRepository;
    private final ResumeRepository resumeRepository;
    private final HeroContentRepository heroContentRepository;
    private final HeaderConfigRepository headerConfigRepository;
    private final AboutContentRepository aboutContentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.initial.username:devayadhala}")
    private String initialAdminUsername;

    @Value("${admin.initial.email:devayadhala04@gmail.com}")
    private String initialAdminEmail;

    @Value("${admin.initial.password:}")
    private String initialAdminPassword;

    @Value("${resume.upload.dir:./data/uploads/resume}")
    private String resumeUploadDir;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        seedHeaderConfig();
        seedHeroContent();
        seedAboutContent();
        seedSkills();
        seedExperience();
        seedProjects();
        seedCertifications();
        seedResume();
    }

    private void seedAdminUser() {
        if (StringUtils.hasText(initialAdminPassword)) {
            if (adminUserRepository.count() == 0) {
                log.info("Seeding initial administrator user '{}' from environment configuration...", initialAdminUsername);
                AdminUser admin = AdminUser.builder()
                        .username(initialAdminUsername.trim())
                        .email(initialAdminEmail.trim())
                        .passwordHash(passwordEncoder.encode(initialAdminPassword))
                        .role("ROLE_ADMIN")
                        .build();
                adminUserRepository.save(admin);
                log.info("Initial admin user initialized successfully.");
            } else {
                List<AdminUser> admins = adminUserRepository.findAll();
                if (!admins.isEmpty()) {
                    AdminUser admin = admins.get(0);
                    admin.setUsername(initialAdminUsername.trim());
                    admin.setEmail(initialAdminEmail.trim());
                    admin.setPasswordHash(passwordEncoder.encode(initialAdminPassword));
                    adminUserRepository.save(admin);
                    log.info("Admin user credentials updated successfully to '{}'.", initialAdminEmail);
                }
            }
        }
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) {
            return;
        }
        log.info("Seeding initial resume-verified skills...");

        List<Skill> skills = List.of(
                // Programming
                Skill.builder().name("Java").category("Programming").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("Python").category("Programming").proficiency(85).displayOrder(2).build(),

                // Backend & Frameworks
                Skill.builder().name("Spring").category("Backend & Frameworks").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("Spring Boot").category("Backend & Frameworks").proficiency(90).displayOrder(2).build(),
                Skill.builder().name("Hibernate").category("Backend & Frameworks").proficiency(85).displayOrder(3).build(),
                Skill.builder().name("JPA").category("Backend & Frameworks").proficiency(85).displayOrder(4).build(),
                Skill.builder().name("REST APIs").category("Backend & Frameworks").proficiency(90).displayOrder(5).build(),

                // Frontend
                Skill.builder().name("HTML").category("Frontend").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("CSS").category("Frontend").proficiency(85).displayOrder(2).build(),
                Skill.builder().name("JavaScript").category("Frontend").proficiency(85).displayOrder(3).build(),
                Skill.builder().name("React").category("Frontend").proficiency(85).displayOrder(4).build(),

                // Databases
                Skill.builder().name("SQL").category("Databases").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("PostgreSQL").category("Databases").proficiency(90).displayOrder(2).build(),
                Skill.builder().name("MySQL").category("Databases").proficiency(85).displayOrder(3).build(),
                Skill.builder().name("SQLite").category("Databases").proficiency(85).displayOrder(4).build(),

                // Tools & Platforms
                Skill.builder().name("Git").category("Tools & Platforms").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("GitHub").category("Tools & Platforms").proficiency(90).displayOrder(2).build(),
                Skill.builder().name("Postman").category("Tools & Platforms").proficiency(90).displayOrder(3).build(),
                Skill.builder().name("Docker").category("Tools & Platforms").proficiency(80).displayOrder(4).build(),
                Skill.builder().name("VS Code").category("Tools & Platforms").proficiency(90).displayOrder(5).build(),
                Skill.builder().name("Eclipse").category("Tools & Platforms").proficiency(85).displayOrder(6).build(),
                Skill.builder().name("IntelliJ IDEA").category("Tools & Platforms").proficiency(85).displayOrder(7).build(),

                // Engineering Skills
                Skill.builder().name("Object-Oriented Programming").category("Engineering Skills").proficiency(90).displayOrder(1).build(),
                Skill.builder().name("REST API Development").category("Engineering Skills").proficiency(90).displayOrder(2).build(),
                Skill.builder().name("Database Design").category("Engineering Skills").proficiency(85).displayOrder(3).build(),
                Skill.builder().name("Debugging").category("Engineering Skills").proficiency(90).displayOrder(4).build(),
                Skill.builder().name("Problem Solving").category("Engineering Skills").proficiency(95).displayOrder(5).build()
        );

        skillRepository.saveAll(skills);
        log.info("Seeded {} skills successfully.", skills.size());
    }

    private void seedExperience() {
        if (experienceRepository.count() > 0) return;
        log.info("Seeding resume-verified career experience...");

        List<Experience> experiences = List.of(
                Experience.builder()
                        .organization("HCLTech")
                        .role("Graduate Engineer Trainee")
                        .location("Chennai")
                        .startDate("Jan 2026")
                        .endDate("Present")
                        .description("Working as a Graduate Engineer Trainee focusing on enterprise software engineering, robust backend services, system integration, and production development practices.")
                        .displayOrder(1)
                        .build(),

                Experience.builder()
                        .organization("BISAG-N")
                        .role("Young Professional")
                        .location("New Delhi")
                        .startDate("Aug 2025")
                        .endDate("Dec 2025")
                        .description("Contributed as a Young Professional on technical software systems, data engineering workflows, and system architecture tasks.")
                        .displayOrder(2)
                        .build(),

                Experience.builder()
                        .organization("Infosys Limited")
                        .role("Software Developer Intern")
                        .location("Chennai")
                        .startDate("Jul 2025")
                        .endDate("Aug 2025")
                        .description("Completed an intensive Software Developer Internship acquiring hands-on expertise in software engineering lifecycle, backend service development, and full-stack application modules.")
                        .displayOrder(3)
                        .build()
        );

        experienceRepository.saveAll(experiences);
        log.info("Seeded {} experience records.", experiences.size());
    }

    private void seedProjects() {
        if (projectRepository.count() > 0) {
            // Auto-backfill features for existing seeded projects if empty
            List<Project> existing = projectRepository.findAll();
            for (Project p : existing) {
                if (p.getFeatures() == null || p.getFeatures().isEmpty()) {
                    String title = (p.getTitle() != null ? p.getTitle() : "").toLowerCase();
                    if (title.contains("user data management")) {
                        p.setFeatures(new java.util.ArrayList<>(List.of(
                                "RESTful API architecture built with Java and Spring Boot",
                                "Relational data persistence and schema management in PostgreSQL",
                                "Dynamic user views rendered via server-side JSP",
                                "Automated Excel spreadsheet generation using Apache POI",
                                "Dynamic PDF document and report export utilizing OpenPDF"
                        )));
                        projectRepository.save(p);
                    } else if (title.contains("retail sales") || title.contains("data warehouse")) {
                        p.setFeatures(new java.util.ArrayList<>(List.of(
                                "Automated data extraction, cleaning, and preprocessing with Pandas",
                                "Structured relational data warehouse storage in SQLite",
                                "Analytical SQL queries for aggregation, sales metrics, and performance tracking",
                                "Visual sales distribution charts and trend reporting with Matplotlib"
                        )));
                        projectRepository.save(p);
                    } else if (title.contains("accounts receivable") || title.contains("receivable analytics")) {
                        p.setFeatures(new java.util.ArrayList<>(List.of(
                                "Real-time financial KPI tracking and accounts receivable monitoring",
                                "Invoice aging analysis and overdue payment tracking",
                                "Payment collection trend forecasting and cash flow analysis",
                                "Customer credit risk profiling and exposure segmentation",
                                "Interactive visual dashboard and drill-down reporting via Tableau"
                        )));
                        projectRepository.save(p);
                    }
                }
            }
            return;
        }
        log.info("Seeding resume-verified projects with normalized technologies and key features...");

        // 1. User Data Management System
        // Technologies: Java, Spring Boot, PostgreSQL, JSP, Apache POI, OpenPDF, REST APIs
        Set<Technology> techProject1 = getOrCreateTechnologies(Set.of(
                "Java", "Spring Boot", "PostgreSQL", "JSP", "Apache POI", "OpenPDF", "REST APIs"
        ));

        Project p1 = Project.builder()
                .title("User Data Management System")
                .description("A comprehensive user data management application built with Java and Spring Boot providing secure RESTful endpoints, persistent PostgreSQL storage, dynamic JSP views, and automated document generation supporting Excel exports via Apache POI and PDF report generation with OpenPDF.")
                .technologies(techProject1)
                .features(new java.util.ArrayList<>(List.of(
                        "RESTful API architecture built with Java and Spring Boot",
                        "Relational data persistence and schema management in PostgreSQL",
                        "Dynamic user views rendered via server-side JSP",
                        "Automated Excel spreadsheet generation using Apache POI",
                        "Dynamic PDF document and report export utilizing OpenPDF"
                )))
                .featured(true)
                .displayOrder(1)
                .build();

        // 2. Retail Sales Data Warehouse & Visualization Project
        // Technologies: SQL, SQLite, Pandas, Matplotlib
        Set<Technology> techProject2 = getOrCreateTechnologies(Set.of(
                "SQL", "SQLite", "Pandas", "Matplotlib"
        ));

        Project p2 = Project.builder()
                .title("Retail Sales Data Warehouse & Visualization Project")
                .description("An end-to-end retail sales analytics and data warehousing solution implementing automated data extraction, cleaning, and structuring with Pandas, relational storage in SQLite, complex analytical SQL queries, and visual sales distribution reporting using Matplotlib.")
                .technologies(techProject2)
                .features(new java.util.ArrayList<>(List.of(
                        "Automated data extraction, cleaning, and preprocessing with Pandas",
                        "Structured relational data warehouse storage in SQLite",
                        "Analytical SQL queries for aggregation, sales metrics, and performance tracking",
                        "Visual sales distribution charts and trend reporting with Matplotlib"
                )))
                .featured(true)
                .displayOrder(2)
                .build();

        // 3. Accounts Receivable Analytics Dashboard
        // Technologies: Tableau, KPI tracking, Aging analysis, Payment trends, Overdue monitoring, Customer risk analysis
        Set<Technology> techProject3 = getOrCreateTechnologies(Set.of(
                "Tableau", "KPI tracking", "Aging analysis", "Payment trends", "Overdue monitoring", "Customer risk analysis"
        ));

        Project p3 = Project.builder()
                .title("Accounts Receivable Analytics Dashboard")
                .description("An analytical business intelligence dashboard designed for monitoring financial receivables, providing real-time KPI tracking, aging analysis, payment trend forecasting, overdue monitoring, and customer credit risk profiling to optimize cash flow operations.")
                .technologies(techProject3)
                .features(new java.util.ArrayList<>(List.of(
                        "Real-time financial KPI tracking and accounts receivable monitoring",
                        "Invoice aging analysis and overdue payment tracking",
                        "Payment collection trend forecasting and cash flow analysis",
                        "Customer credit risk profiling and exposure segmentation",
                        "Interactive visual dashboard and drill-down reporting via Tableau"
                )))
                .featured(true)
                .displayOrder(3)
                .build();

        projectRepository.saveAll(List.of(p1, p2, p3));
        log.info("Seeded {} projects with normalized relational tags and architecture features.", 3);
    }

    private void seedCertifications() {
        if (certificationRepository.count() > 0) return;
        log.info("Seeding resume-verified certifications...");

        List<Certification> certs = List.of(
                Certification.builder()
                        .name("Java Full Stack Development")
                        .issuer("Wipro TalentNext")
                        .issuedDate("2024")
                        .displayOrder(1)
                        .build(),

                Certification.builder()
                        .name("Programming using Java")
                        .issuer("Infosys Springboard")
                        .issuedDate("2024")
                        .displayOrder(2)
                        .build(),

                Certification.builder()
                        .name("Python Essentials 1 & 2")
                        .issuer("Cisco Networking Academy")
                        .issuedDate("2024")
                        .displayOrder(3)
                        .build(),

                Certification.builder()
                        .name("SQL Basic, Intermediate & Advanced")
                        .issuer("HackerRank")
                        .issuedDate("2024")
                        .displayOrder(4)
                        .build()
        );

        certificationRepository.saveAll(certs);
        log.info("Seeded {} certifications.", certs.size());
    }

    private void seedResume() {
        if (resumeRepository.findFirstByActiveTrueOrderByUploadedAtDesc().isPresent()) return;
        try {
            Path dir = Paths.get(resumeUploadDir).toAbsolutePath().normalize();
            if (Files.exists(dir)) {
                try (Stream<Path> files = Files.list(dir)) {
                    Optional<Path> pdfFile = files
                            .filter(Files::isRegularFile)
                            .filter(p -> p.getFileName().toString().toLowerCase().endsWith(".pdf"))
                            .findFirst();

                    if (pdfFile.isPresent()) {
                        Path file = pdfFile.get();
                        long size = Files.size(file);
                        Resume resume = Resume.builder()
                                .fileName("Deva_Yadhala_Resume.pdf")
                                .originalFileName(file.getFileName().toString())
                                .contentType("application/pdf")
                                .fileSize(size)
                                .storagePath(file.toString())
                                .active(true)
                                .build();
                        resumeRepository.save(resume);
                        log.info("Auto-registered existing PDF resume '{}' (size: {} bytes) as active resume.", file.getFileName(), size);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not auto-seed existing resume PDF: {}", e.getMessage());
        }
    }

    private void seedHeroContent() {
        if (heroContentRepository.count() == 0) {
            log.info("Seeding initial default Hero content configuration...");
            HeroContent hero = HeroContent.builder()
                    .greeting("Hi, I'm")
                    .name("Deva Yadhala")
                    .role("Software Developer")
                    .description("Specializing in Java, Spring Boot, Python, SQL, and data analytics, with experience building REST APIs, database-driven applications, and data visualization solutions. I apply strong programming and analytical skills to develop scalable, maintainable software.")
                    .primaryButtonText("View Resume")
                    .primaryButtonVisible(true)
                    .secondaryButtonText("Contact Me")
                    .secondaryButtonVisible(true)
                    .githubUrl("https://github.com")
                    .linkedinUrl("https://linkedin.com")
                    .quote("Think deeper. Build smarter. Solve better.")
                    .quoteVisible(true)
                    .build();

            hero.addStage(HeroStage.builder()
                    .stageNumber("STAGE 01")
                    .title("Analytical Logic")
                    .icon("Brain")
                    .accent("cyan")
                    .displayOrder(1)
                    .visible(true)
                    .build());

            hero.addStage(HeroStage.builder()
                    .stageNumber("STAGE 02")
                    .title("Clean Architecture")
                    .icon("Code2")
                    .accent("emerald")
                    .displayOrder(2)
                    .visible(true)
                    .build());

            hero.addStage(HeroStage.builder()
                    .stageNumber("STAGE 03")
                    .title("Scalable Solutions")
                    .icon("Sparkles")
                    .accent("amber")
                    .displayOrder(3)
                    .visible(true)
                    .build());

            heroContentRepository.save(hero);
            log.info("Hero content successfully seeded with 3 default stages.");
        }
    }

    private void seedHeaderConfig() {
        if (headerConfigRepository.count() == 0) {
            log.info("Seeding initial default Header / Navigation configuration...");
            HeaderConfig config = HeaderConfig.builder()
                    .logoText("DY")
                    .brandName("Deva Yadhala")
                    .build();

            config.addNavItem(HeaderNavItem.builder()
                    .name("About")
                    .sectionId("about")
                    .href("#about")
                    .displayOrder(1)
                    .visible(true)
                    .isExternal(false)
                    .build());

            config.addNavItem(HeaderNavItem.builder()
                    .name("Skills")
                    .sectionId("skills")
                    .href("#skills")
                    .displayOrder(2)
                    .visible(true)
                    .isExternal(false)
                    .build());

            config.addNavItem(HeaderNavItem.builder()
                    .name("Experience")
                    .sectionId("experience")
                    .href("#experience")
                    .displayOrder(3)
                    .visible(true)
                    .isExternal(false)
                    .build());

            config.addNavItem(HeaderNavItem.builder()
                    .name("Projects")
                    .sectionId("projects")
                    .href("#projects")
                    .displayOrder(4)
                    .visible(true)
                    .isExternal(false)
                    .build());

            config.addNavItem(HeaderNavItem.builder()
                    .name("Certifications")
                    .sectionId("certifications")
                    .href("#certifications")
                    .displayOrder(5)
                    .visible(true)
                    .isExternal(false)
                    .build());

            config.addNavItem(HeaderNavItem.builder()
                    .name("Contact")
                    .sectionId("contact")
                    .href("#contact")
                    .displayOrder(6)
                    .visible(true)
                    .isExternal(false)
                    .build());

            headerConfigRepository.save(config);
            log.info("Header configuration successfully seeded with 6 default navigation items.");
        }
    }

    private void seedAboutContent() {
        if (aboutContentRepository.count() == 0) {
            log.info("Seeding initial default About section configuration...");
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
            aboutContentRepository.save(content);
            log.info("About section content successfully seeded with 3 default capability cards and B.Tech education.");
        }
    }

    private Set<Technology> getOrCreateTechnologies(Set<String> techNames) {
        Set<Technology> result = new HashSet<>();
        for (String name : techNames) {
            Technology tech = technologyRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> technologyRepository.save(Technology.builder().name(name).build()));
            result.add(tech);
        }
        return result;
    }
}
