package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionHeaderRequest {

    @NotBlank(message = "Badge text cannot be empty")
    @Size(max = 100, message = "Badge text cannot exceed 100 characters")
    private String badgeText;

    @NotBlank(message = "Section description cannot be empty")
    @Size(max = 500, message = "Section description cannot exceed 500 characters")
    private String description;
}
