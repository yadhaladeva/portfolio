package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.request.SectionHeaderRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.SectionHeaderResponse;
import com.deva.portfolio.service.SectionHeaderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "3. Admin CMS Management", description = "Protected administrative CRUD endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSectionHeaderController {

    private final SectionHeaderService sectionHeaderService;

    private String resolveSectionKey(String sectionKey, HttpServletRequest request) {
        if (sectionKey != null && !sectionKey.trim().isEmpty()) {
            return sectionKey.trim().toUpperCase();
        }
        String uri = request.getRequestURI().toUpperCase();
        if (uri.contains("/SKILLS")) return "SKILLS";
        if (uri.contains("/EXPERIENCE")) return "EXPERIENCE";
        if (uri.contains("/PROJECTS")) return "PROJECTS";
        if (uri.contains("/CERTIFICATIONS")) return "CERTIFICATIONS";
        if (uri.contains("/CONTACT")) return "CONTACT";
        return "SKILLS";
    }

    @Operation(summary = "Get Section Header", description = "Fetches section badge text and description for editing in Admin Portal.")
    @GetMapping({
            "/skills/header",
            "/experience/header",
            "/projects/header",
            "/certifications/header",
            "/section-header/{sectionKey}",
            "/section-headers/{sectionKey}"
    })
    public ResponseEntity<ApiResponse<SectionHeaderResponse>> getHeader(
            @PathVariable(required = false) String sectionKey,
            HttpServletRequest request) {
        String key = resolveSectionKey(sectionKey, request);
        return ResponseEntity.ok(ApiResponse.success(sectionHeaderService.getHeader(key)));
    }

    @Operation(summary = "Update Section Header", description = "Updates badge text and description for a portfolio section.")
    @PutMapping({
            "/skills/header",
            "/experience/header",
            "/projects/header",
            "/certifications/header",
            "/section-header/{sectionKey}",
            "/section-headers/{sectionKey}"
    })
    public ResponseEntity<ApiResponse<SectionHeaderResponse>> updateHeader(
            @PathVariable(required = false) String sectionKey,
            @Valid @RequestBody SectionHeaderRequest body,
            HttpServletRequest request) {
        String key = resolveSectionKey(sectionKey, request);
        return ResponseEntity.ok(ApiResponse.success(
                key + " header updated successfully",
                sectionHeaderService.updateHeader(key, body)
        ));
    }

    @Operation(summary = "Reset Section Header", description = "Resets section badge and description to canonical defaults.")
    @PostMapping({
            "/skills/header/reset",
            "/experience/header/reset",
            "/projects/header/reset",
            "/certifications/header/reset",
            "/section-header/{sectionKey}/reset",
            "/section-headers/{sectionKey}/reset"
    })
    public ResponseEntity<ApiResponse<SectionHeaderResponse>> resetHeader(
            @PathVariable(required = false) String sectionKey,
            HttpServletRequest request) {
        String key = resolveSectionKey(sectionKey, request);
        return ResponseEntity.ok(ApiResponse.success(
                key + " header reset to defaults successfully",
                sectionHeaderService.resetHeader(key)
        ));
    }
}
