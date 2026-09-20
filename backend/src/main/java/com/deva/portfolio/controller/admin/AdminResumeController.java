package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ResumeResponse;
import com.deva.portfolio.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Protected Admin Controller for Resume upload, replacement, and management.
 */
@Tag(name = "Admin - Resume Management", description = "Admin endpoints for uploading and managing active resume PDF")
@RestController
@RequestMapping("/api/admin/resume")
@RequiredArgsConstructor
public class AdminResumeController {

    private final ResumeService resumeService;

    @Operation(summary = "Get Active Resume", description = "Retrieves active resume metadata for admin management.")
    @GetMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> getActiveResume() {
        return resumeService.getActiveResume()
                .map(resume -> ResponseEntity.ok(ApiResponse.success(resume)))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.success("No resume uploaded yet", null)));
    }

    @Operation(summary = "Get All Resumes", description = "Retrieves history of all uploaded resumes.")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getAllResumes() {
        return ResponseEntity.ok(ApiResponse.success(resumeService.getAllResumes()));
    }

    @Operation(summary = "Upload / Replace Resume PDF", description = "Uploads a new PDF resume and sets it as the active resume.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file) {
        ResumeResponse uploaded = resumeService.uploadResume(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded and activated successfully", uploaded));
    }

    @Operation(summary = "Delete Resume", description = "Permanently deletes a resume record and its stored file.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }
}
