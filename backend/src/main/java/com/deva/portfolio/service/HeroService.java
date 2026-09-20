package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.HeroContentRequest;
import com.deva.portfolio.dto.request.HeroStageRequest;
import com.deva.portfolio.dto.response.HeroContentResponse;
import com.deva.portfolio.dto.response.HeroStageResponse;
import com.deva.portfolio.entity.HeroContent;
import com.deva.portfolio.entity.HeroStage;
import com.deva.portfolio.repository.HeroContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeroService {

    private final HeroContentRepository heroContentRepository;

    private static final Set<String> ALLOWED_ICONS = Set.of(
            "Brain", "Code2", "Sparkles", "Zap", "Layers", "Cpu", "Database", "BarChart3"
    );

    private static final Set<String> ALLOWED_ACCENTS = Set.of(
            "cyan", "emerald", "amber", "purple", "blue"
    );

    @Transactional
    public HeroContentResponse getHeroContent() {
        HeroContent hero = heroContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> heroContentRepository.save(createDefaultHeroContent()));
        return mapToResponse(hero);
    }

    @Transactional
    public HeroContentResponse updateHeroContent(HeroContentRequest request) {
        HeroContent hero = heroContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultHeroContent);

        hero.setGreeting(request.getGreeting().trim());
        hero.setName(request.getName().trim());
        hero.setRole(request.getRole().trim());
        hero.setDescription(request.getDescription().trim());

        hero.setPrimaryButtonText(request.getPrimaryButtonText() != null ? request.getPrimaryButtonText().trim() : "View Resume");
        hero.setPrimaryButtonVisible(request.getPrimaryButtonVisible() != null ? request.getPrimaryButtonVisible() : true);
        hero.setSecondaryButtonText(request.getSecondaryButtonText() != null ? request.getSecondaryButtonText().trim() : "Contact Me");
        hero.setSecondaryButtonVisible(request.getSecondaryButtonVisible() != null ? request.getSecondaryButtonVisible() : true);

        hero.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : "https://github.com");
        hero.setLinkedinUrl(request.getLinkedinUrl() != null ? request.getLinkedinUrl().trim() : "https://linkedin.com");

        hero.setQuote(request.getQuote() != null ? request.getQuote().trim() : "Think deeper. Build smarter. Solve better.");
        hero.setQuoteVisible(request.getQuoteVisible() != null ? request.getQuoteVisible() : true);

        hero.clearStages();

        if (request.getStages() != null) {
            int order = 0;
            for (HeroStageRequest stageReq : request.getStages()) {
                String safeIcon = (stageReq.getIcon() != null && ALLOWED_ICONS.contains(stageReq.getIcon()))
                        ? stageReq.getIcon()
                        : "Brain";

                String safeAccent = (stageReq.getAccent() != null && ALLOWED_ACCENTS.contains(stageReq.getAccent().toLowerCase()))
                        ? stageReq.getAccent().toLowerCase()
                        : "cyan";

                HeroStage stage = HeroStage.builder()
                        .stageNumber(stageReq.getStageNumber() != null ? stageReq.getStageNumber().trim() : "STAGE " + (order + 1))
                        .title(stageReq.getTitle() != null ? stageReq.getTitle().trim() : "")
                        .icon(safeIcon)
                        .accent(safeAccent)
                        .displayOrder(stageReq.getDisplayOrder() != null ? stageReq.getDisplayOrder() : order)
                        .visible(stageReq.getVisible() != null ? stageReq.getVisible() : true)
                        .build();

                hero.addStage(stage);
                order++;
            }
        }

        HeroContent saved = heroContentRepository.save(hero);
        return mapToResponse(saved);
    }

    @Transactional
    public HeroContentResponse resetToDefaults() {
        HeroContent hero = heroContentRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultHeroContent);

        hero.setGreeting("Hi, I'm");
        hero.setName("Deva Yadhala");
        hero.setRole("Software Developer");
        hero.setDescription("Specializing in Java, Spring Boot, Python, SQL, and data analytics, with experience building REST APIs, database-driven applications, and data visualization solutions. I apply strong programming and analytical skills to develop scalable, maintainable software.");

        hero.setPrimaryButtonText("View Resume");
        hero.setPrimaryButtonVisible(true);
        hero.setSecondaryButtonText("Contact Me");
        hero.setSecondaryButtonVisible(true);

        hero.setGithubUrl("https://github.com");
        hero.setLinkedinUrl("https://linkedin.com");

        hero.setQuote("Think deeper. Build smarter. Solve better.");
        hero.setQuoteVisible(true);

        hero.clearStages();

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

        HeroContent saved = heroContentRepository.save(hero);
        return mapToResponse(saved);
    }

    public HeroContent createDefaultHeroContent() {
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
                .stages(new ArrayList<>())
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

        return hero;
    }

    private HeroContentResponse mapToResponse(HeroContent hero) {
        List<HeroStageResponse> stageResponses = hero.getStages().stream()
                .map(stage -> HeroStageResponse.builder()
                        .id(stage.getId())
                        .stageNumber(stage.getStageNumber())
                        .title(stage.getTitle())
                        .icon(stage.getIcon())
                        .accent(stage.getAccent())
                        .displayOrder(stage.getDisplayOrder())
                        .visible(stage.getVisible())
                        .build())
                .collect(Collectors.toList());

        return HeroContentResponse.builder()
                .id(hero.getId())
                .greeting(hero.getGreeting())
                .name(hero.getName())
                .role(hero.getRole())
                .description(hero.getDescription())
                .primaryButtonText(hero.getPrimaryButtonText())
                .primaryButtonVisible(hero.getPrimaryButtonVisible())
                .secondaryButtonText(hero.getSecondaryButtonText())
                .secondaryButtonVisible(hero.getSecondaryButtonVisible())
                .githubUrl(hero.getGithubUrl())
                .linkedinUrl(hero.getLinkedinUrl())
                .quote(hero.getQuote())
                .quoteVisible(hero.getQuoteVisible())
                .stages(stageResponses)
                .updatedAt(hero.getUpdatedAt())
                .build();
    }
}
