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
public class HeroContentRequest {

    @NotBlank(message = "Greeting is required (e.g. Hi, I'm)")
    private String greeting;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Role title is required")
    private String role;

    @NotBlank(message = "Description is required")
    private String description;

    @Builder.Default
    private String primaryButtonText = "View Resume";

    @Builder.Default
    private Boolean primaryButtonVisible = true;

    @Builder.Default
    private String secondaryButtonText = "Contact Me";

    @Builder.Default
    private Boolean secondaryButtonVisible = true;

    private String githubUrl;
    private String linkedinUrl;

    private String quote;

    @Builder.Default
    private Boolean quoteVisible = true;

    @Valid
    @Builder.Default
    private List<HeroStageRequest> stages = new ArrayList<>();
}
