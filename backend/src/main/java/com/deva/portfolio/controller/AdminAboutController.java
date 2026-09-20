package com.deva.portfolio.controller;

import com.deva.portfolio.dto.request.AboutContentRequest;
import com.deva.portfolio.dto.response.AboutContentResponse;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.service.AboutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "3. Admin Management - About", description = "Admin endpoints for About section content, capability cards, education history, and current role")
@RestController
@RequestMapping("/api/admin/about")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminAboutController {

    private final AboutService aboutService;

    @Operation(summary = "Get About Section Configuration", description = "Fetches the full editable About section configuration for the admin panel.")
    @GetMapping
    public ResponseEntity<ApiResponse<AboutContentResponse>> getAboutContent() {
        return ResponseEntity.ok(ApiResponse.success(aboutService.getAboutContent(false)));
    }

    @Operation(summary = "Update About Section Content", description = "Updates About summaries, capability cards, education list (including multiple degrees), and current role.")
    @PutMapping
    public ResponseEntity<ApiResponse<AboutContentResponse>> updateAboutContent(@Valid @RequestBody AboutContentRequest request) {
        AboutContentResponse updated = aboutService.updateAboutContent(request);
        return ResponseEntity.ok(ApiResponse.success("About section updated successfully", updated));
    }

    @Operation(summary = "Reset About to Defaults", description = "Restores canonical About content, capabilities, B.Tech education, and current role.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<AboutContentResponse>> resetToDefaults() {
        AboutContentResponse reset = aboutService.resetToDefaults();
        return ResponseEntity.ok(ApiResponse.success("About section reset to canonical defaults successfully", reset));
    }
}
