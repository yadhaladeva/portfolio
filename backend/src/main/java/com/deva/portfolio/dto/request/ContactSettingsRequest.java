package com.deva.portfolio.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactSettingsRequest {

    @NotBlank(message = "Section badge text is required")
    @Size(max = 100, message = "Badge text cannot exceed 100 characters")
    private String badgeText;

    @NotBlank(message = "Introductory text is required")
    @Size(max = 500, message = "Intro text cannot exceed 500 characters")
    private String introText;

    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String location;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @Size(max = 50, message = "Phone number cannot exceed 50 characters")
    private String phone;

    @Size(max = 255, message = "LinkedIn URL cannot exceed 255 characters")
    private String linkedinUrl;

    @Size(max = 255, message = "GitHub URL cannot exceed 255 characters")
    private String githubUrl;

    @NotBlank(message = "Form heading is required")
    @Size(max = 100, message = "Form heading cannot exceed 100 characters")
    private String formTitle;

    @NotBlank(message = "Form description is required")
    @Size(max = 500, message = "Form description cannot exceed 500 characters")
    private String formDescription;

    @Size(max = 100, message = "Name placeholder cannot exceed 100 characters")
    private String namePlaceholder;

    @Size(max = 100, message = "Email placeholder cannot exceed 100 characters")
    private String emailPlaceholder;

    @Size(max = 150, message = "Subject placeholder cannot exceed 150 characters")
    private String subjectPlaceholder;

    @Size(max = 150, message = "Message placeholder cannot exceed 150 characters")
    private String messagePlaceholder;

    @NotBlank(message = "Submit button text is required")
    @Size(max = 50, message = "Submit button text cannot exceed 50 characters")
    private String submitButtonText;
}
