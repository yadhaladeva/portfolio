package com.deva.portfolio.controller;

import com.deva.portfolio.dto.request.HeaderConfigRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.HeaderConfigResponse;
import com.deva.portfolio.service.HeaderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "3. Admin Management - Header", description = "Admin endpoints for Header branding and navigation items")
@RestController
@RequestMapping("/api/admin/header")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class AdminHeaderController {

    private final HeaderService headerService;

    @Operation(summary = "Get Header Navigation Configuration", description = "Fetches the full editable header configuration for the admin panel.")
    @GetMapping
    public ResponseEntity<ApiResponse<HeaderConfigResponse>> getHeaderConfig() {
        return ResponseEntity.ok(ApiResponse.success(headerService.getHeaderConfig()));
    }

    @Operation(summary = "Update Header Navigation", description = "Updates brand logo text, brand name, and ordered navigation items.")
    @PutMapping
    public ResponseEntity<ApiResponse<HeaderConfigResponse>> updateHeaderConfig(@Valid @RequestBody HeaderConfigRequest request) {
        HeaderConfigResponse updated = headerService.updateHeaderConfig(request);
        return ResponseEntity.ok(ApiResponse.success("Header navigation updated successfully", updated));
    }

    @Operation(summary = "Reset Header to Defaults", description = "Restores header branding and the canonical 6 navigation links.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<HeaderConfigResponse>> resetToDefaults() {
        HeaderConfigResponse reset = headerService.resetToDefaults();
        return ResponseEntity.ok(ApiResponse.success("Header reset to canonical defaults successfully", reset));
    }
}
