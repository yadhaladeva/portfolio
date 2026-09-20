package com.deva.portfolio.controller;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ResumeResponse;
import com.deva.portfolio.entity.Resume;
import com.deva.portfolio.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public REST Controller for fetching active resume metadata and streaming the active PDF.
 */
@Tag(name = "3. Public Resume", description = "Public endpoints for active resume metadata, download, and preview")
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class PublicResumeController {

    private final ResumeService resumeService;

    @Operation(summary = "Get Active Resume Metadata", description = "Fetches metadata for the currently active uploaded resume.")
    @GetMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> getActiveResume() {
        return resumeService.getActiveResume()
                .map(resume -> ResponseEntity.ok(ApiResponse.success(resume)))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.success("No active resume is currently uploaded.", null)));
    }

    @Operation(summary = "Download Active Resume", description = "Directly downloads the currently active resume PDF file.")
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadActiveResume() {
        Resume resume = resumeService.getActiveResumeEntity();
        Resource resource = resumeService.loadResumeResource(resume);

        String downloadFileName = (resume.getFileName() != null && !resume.getFileName().isBlank())
                ? resume.getFileName()
                : "Deva_Yadhala_Resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFileName + "\"")
                .body(resource);
    }

    @Operation(summary = "Preview Active Resume", description = "Streams the active resume PDF for inline browser viewing.")
    @GetMapping("/preview")
    public ResponseEntity<Resource> previewActiveResume() {
        Resume resume = resumeService.getActiveResumeEntity();
        Resource resource = resumeService.loadResumeResource(resume);

        String previewFileName = (resume.getFileName() != null && !resume.getFileName().isBlank())
                ? resume.getFileName()
                : "Deva_Yadhala_Resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + previewFileName + "\"")
                .body(resource);
    }
}
