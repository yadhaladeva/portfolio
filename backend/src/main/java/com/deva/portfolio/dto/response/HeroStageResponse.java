package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroStageResponse {
    private Long id;
    private String stageNumber;
    private String title;
    private String icon;
    private String accent;
    private Integer displayOrder;
    private Boolean visible;
}
