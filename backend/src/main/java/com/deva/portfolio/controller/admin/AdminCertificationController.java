package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.request.CertificationRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.CertificationResponse;
import com.deva.portfolio.service.CertificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Protected Admin Controller for Certifications CRUD management and certificate file uploads.
 */
@RestController
@RequestMapping("/api/admin/certifications")
@RequiredArgsConstructor
@Tag(name = "Admin Certifications", description = "Admin CRUD endpoints for certifications with optional certificate upload")
public class AdminCertificationController {

    private final CertificationService certificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getAllCertifications() {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getAllCertifications()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> getCertificationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getCertificationById(id)));
    }

    @Operation(summary = "Create Certification (Multipart Form Data with optional certificate file)")
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<CertificationResponse>> createCertificationMultipart(
            @Valid @ModelAttribute CertificationRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        CertificationResponse created = certificationService.createCertification(request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certification created successfully", created));
    }

    @Operation(summary = "Create Certification (JSON without file)")
    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ApiResponse<CertificationResponse>> createCertificationJson(
            @Valid @RequestBody CertificationRequest request) {
        CertificationResponse created = certificationService.createCertification(request, null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certification created successfully", created));
    }

    @Operation(summary = "Update Certification (Multipart Form Data with optional replacement file)")
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertificationMultipart(
            @PathVariable Long id,
            @Valid @ModelAttribute CertificationRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        CertificationResponse updated = certificationService.updateCertification(id, request, file);
        return ResponseEntity.ok(ApiResponse.success("Certification updated successfully", updated));
    }

    @Operation(summary = "Update Certification (JSON)")
    @PutMapping(value = "/{id}", consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertificationJson(
            @PathVariable Long id,
            @Valid @RequestBody CertificationRequest request) {
        CertificationResponse updated = certificationService.updateCertification(id, request, null);
        return ResponseEntity.ok(ApiResponse.success("Certification updated successfully", updated));
    }

    @Operation(summary = "Remove Certificate File Only (Keep Certification Record)")
    @DeleteMapping("/{id}/certificate")
    public ResponseEntity<ApiResponse<CertificationResponse>> deleteCertificateFile(@PathVariable Long id) {
        CertificationResponse updated = certificationService.removeCertificateFile(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate file removed successfully", updated));
    }

    @Operation(summary = "Delete Certification and Associated Certificate File")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable Long id) {
        certificationService.deleteCertification(id);
        return ResponseEntity.ok(ApiResponse.success("Certification deleted successfully", null));
    }
}
