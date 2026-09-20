package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.request.ExperienceRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ExperienceResponse;
import com.deva.portfolio.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Protected Admin Controller for Career Experience & Internships CRUD management.
 */
@RestController
@RequestMapping("/api/admin/experience")
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getAllExperience() {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAllExperience()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> getExperienceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getExperienceById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExperienceResponse>> createExperience(
            @Valid @RequestBody ExperienceRequest request) {
        ExperienceResponse created = experienceService.createExperience(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Experience entry created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceRequest request) {
        ExperienceResponse updated = experienceService.updateExperience(id, request);
        return ResponseEntity.ok(ApiResponse.success("Experience entry updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.success("Experience entry deleted successfully", null));
    }
}
