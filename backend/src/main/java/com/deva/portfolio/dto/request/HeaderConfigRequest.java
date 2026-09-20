package com.deva.portfolio.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderConfigRequest {

    @NotBlank(message = "Logo monogram text is required")
    private String logoText;

    @NotBlank(message = "Brand name is required")
    private String brandName;

    @Valid
    @Builder.Default
    private List<HeaderNavItemRequest> navItems = new ArrayList<>();
}
