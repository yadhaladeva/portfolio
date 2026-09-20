package com.deva.portfolio.controller;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.HeroContentResponse;
import com.deva.portfolio.service.HeroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "2. Public Portfolio Content", description = "Public read-only endpoints for Hero content, projects, skills, and experience")
@RestController
@RequestMapping("/api/hero")
@RequiredArgsConstructor
public class PublicHeroController {

    private final HeroService heroService;

    @Operation(summary = "Get Hero Content", description = "Fetches the published Hero section headline, bio, actions, quote, and value proposition stages.")
    @GetMapping
    public ResponseEntity<ApiResponse<HeroContentResponse>> getHero() {
        return ResponseEntity.ok(ApiResponse.success(heroService.getHeroContent()));
    }
}
