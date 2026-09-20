package com.deva.portfolio.controller;

import com.deva.portfolio.dto.response.AboutContentResponse;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.service.AboutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "2. Public Portfolio Content", description = "Public read-only endpoints for About, Hero, Header, projects, skills, and experience")
@RestController
@RequestMapping("/api/about")
@RequiredArgsConstructor
public class PublicAboutController {

    private final AboutService aboutService;

    @Operation(summary = "Get Public About Section Content", description = "Fetches the published About section badge, title, career summary, visible capabilities, visible education records, and current role.")
    @GetMapping
    public ResponseEntity<ApiResponse<AboutContentResponse>> getAboutContent() {
        return ResponseEntity.ok(ApiResponse.success(aboutService.getAboutContent(true)));
    }
}
