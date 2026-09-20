package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.request.HeroContentRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.HeroContentResponse;
import com.deva.portfolio.service.HeroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "3. Admin CMS Management", description = "Protected administrative CRUD endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/admin/hero")
@RequiredArgsConstructor
public class AdminHeroController {

    private final HeroService heroService;

    @Operation(summary = "Get Hero CMS Content", description = "Fetches complete hero section configuration for editing in Admin Portal.")
    @GetMapping
    public ResponseEntity<ApiResponse<HeroContentResponse>> getHero() {
        return ResponseEntity.ok(ApiResponse.success(heroService.getHeroContent()));
    }

    @Operation(summary = "Update Hero Content", description = "Updates hero headline, bio, actions, social URLs, quote, and stages.")
    @PutMapping
    public ResponseEntity<ApiResponse<HeroContentResponse>> updateHero(@Valid @RequestBody HeroContentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Hero content updated successfully", heroService.updateHeroContent(request)));
    }

    @Operation(summary = "Reset Hero to Defaults", description = "Resets hero configuration to the canonical portfolio defaults.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<HeroContentResponse>> resetToDefaults() {
        return ResponseEntity.ok(ApiResponse.success("Hero content reset to defaults successfully", heroService.resetToDefaults()));
    }
}
