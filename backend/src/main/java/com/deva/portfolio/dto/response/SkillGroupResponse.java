package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing a category group of skills (e.g., Programming, Framework, Web, Database, Tools, Soft skills).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGroupResponse {
    private String category;
    private List<SkillResponse> skills;
}
