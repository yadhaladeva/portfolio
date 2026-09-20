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
public class AboutRoleRequest {

    private Long id;

    @NotBlank(message = "Role title is required")
    private String roleTitle;

    @NotBlank(message = "Company name is required")
    private String company;

    private String location;

    private String startDate;

    private String endDate;

    @Builder.Default
    private Boolean current = true;
}
