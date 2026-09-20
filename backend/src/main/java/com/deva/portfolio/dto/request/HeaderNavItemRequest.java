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
public class HeaderNavItemRequest {

    private Long id;

    @NotBlank(message = "Navigation item name is required")
    private String name;

    private String sectionId;

    private String href;

    private Integer displayOrder;

    @Builder.Default
    private Boolean visible = true;

    @Builder.Default
    private Boolean isExternal = false;
}
