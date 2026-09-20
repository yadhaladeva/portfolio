package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.request.ContactSettingsRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ContactSettingsResponse;
import com.deva.portfolio.service.ContactSettingsService;
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
@RequestMapping("/api/admin/contact")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactSettingsService contactSettingsService;

    @Operation(summary = "Get Contact Settings", description = "Fetches complete contact section configuration for editing in Admin Portal.")
    @GetMapping
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> getContactSettings() {
        return ResponseEntity.ok(ApiResponse.success(contactSettingsService.getContactSettings()));
    }

    @Operation(summary = "Update Contact Settings", description = "Updates contact header, location, email, phone, social URLs, and form configuration.")
    @PutMapping
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> updateContactSettings(
            @Valid @RequestBody ContactSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Contact settings updated successfully",
                contactSettingsService.updateContactSettings(request)
        ));
    }

    @Operation(summary = "Reset Contact Settings to Defaults", description = "Resets contact section configuration to canonical defaults.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> resetToDefaults() {
        return ResponseEntity.ok(ApiResponse.success(
                "Contact settings reset to defaults successfully",
                contactSettingsService.resetToDefaults()
        ));
    }
}
