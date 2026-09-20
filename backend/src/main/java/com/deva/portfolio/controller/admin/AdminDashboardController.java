package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.dto.response.DashboardStatsResponse;
import com.deva.portfolio.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Protected Admin Controller for dashboard analytics overview.
 */
@Tag(name = "4. Admin Dashboard", description = "Protected administrative metrics and analytics overview")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Get Dashboard Statistics", description = "Aggregates counts of projects, skills, experience, certifications, and unread messages.")
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats()));
    }
}
