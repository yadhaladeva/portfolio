package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.ContactMessageResponse;
import com.deva.portfolio.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Protected Admin Controller for reviewing and managing contact messages.
 */
@Tag(name = "5. Admin Messages", description = "Protected administrative inbox management")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin/messages")
@RequiredArgsConstructor
public class AdminMessageController {

    private final ContactService contactService;

    @Operation(summary = "Get All Inquiries", description = "Lists all incoming recruiter/visitor contact messages.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactMessageResponse>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.success(contactService.getAllMessages()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "READ");
        ContactMessageResponse updated = contactService.updateMessageStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Message status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }
}
