package com.deva.portfolio.controller;

import com.deva.portfolio.dto.request.ContactMessageRequest;
import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ContactMessageResponse;
import com.deva.portfolio.dto.response.ContactSettingsResponse;
import com.deva.portfolio.service.ContactService;
import com.deva.portfolio.service.ContactSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoint for contact inquiries and dynamic contact section settings.
 */
@Tag(name = "3. Contact Section & Inquiries", description = "Endpoints for visitors to view contact settings and send direct messages")
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final ContactSettingsService contactSettingsService;

    @Operation(summary = "Get Public Contact Section Settings", description = "Fetches published contact section header, details, social URLs, and form placeholders.")
    @GetMapping
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> getContactSettings() {
        return ResponseEntity.ok(ApiResponse.success(contactSettingsService.getContactSettings()));
    }

    @Operation(summary = "Submit Contact Inquiry", description = "Validates and persists visitor contact message (name, email, subject, message).")
    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessageResponse>> submitMessage(
            @Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = contactService.saveMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Thank you for reaching out! Your message has been sent.", response));
    }
}

