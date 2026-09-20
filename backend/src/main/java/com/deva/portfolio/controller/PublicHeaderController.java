package com.deva.portfolio.controller;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.HeaderConfigResponse;
import com.deva.portfolio.service.HeaderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "2. Public Portfolio Content", description = "Public read-only endpoints for Header, Hero, projects, skills, and experience")
@RestController
@RequestMapping("/api/header")
@RequiredArgsConstructor
public class PublicHeaderController {

    private final HeaderService headerService;

    @Operation(summary = "Get Public Header Navigation", description = "Fetches the published Header brand configuration and active navigation items.")
    @GetMapping
    public ResponseEntity<ApiResponse<HeaderConfigResponse>> getHeaderConfig() {
        return ResponseEntity.ok(ApiResponse.success(headerService.getHeaderConfig()));
    }
}
