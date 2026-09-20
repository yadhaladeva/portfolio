package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Focused portfolio metrics for the private admin dashboard overview.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalProjects;
    private long totalSkills;
    private long totalExperience;
    private long totalCertifications;
    private long unreadMessages;
    private long totalMessages;
    private Map<String, Long> skillsByCategory;
}
