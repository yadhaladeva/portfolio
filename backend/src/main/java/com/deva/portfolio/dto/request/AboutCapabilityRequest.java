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
public class AboutCapabilityRequest {

    private Long id;

    @NotBlank(message = "Capability title is required")
    private String title;

    @NotBlank(message = "Capability description is required")
    private String description;

    @Builder.Default
    private String icon = "Server";

    @Builder.Default
    private String accent = "emerald";

    private Integer displayOrder;

    @Builder.Default
    private Boolean visible = true;
}
