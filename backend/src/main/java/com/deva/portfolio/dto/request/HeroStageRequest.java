package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroStageRequest {

    private Long id;

    @NotBlank(message = "Stage number label is required (e.g. STAGE 01)")
    private String stageNumber;

    @NotBlank(message = "Stage title is required")
    private String title;

    @Builder.Default
    private String icon = "Brain";

    @Builder.Default
    private String accent = "cyan";

    @Builder.Default
    private Integer displayOrder = 0;

    @Builder.Default
    private Boolean visible = true;
}
