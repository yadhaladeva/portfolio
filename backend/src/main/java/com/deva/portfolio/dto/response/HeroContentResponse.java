package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroContentResponse {
    private Long id;
    private String greeting;
    private String name;
    private String role;
    private String description;
    private String primaryButtonText;
    private Boolean primaryButtonVisible;
    private String secondaryButtonText;
    private Boolean secondaryButtonVisible;
    private String githubUrl;
    private String linkedinUrl;
    private String quote;
    private Boolean quoteVisible;
    @Builder.Default
    private List<HeroStageResponse> stages = new ArrayList<>();
    private LocalDateTime updatedAt;
}
