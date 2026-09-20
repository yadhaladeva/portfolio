package com.deva.portfolio.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactSettingsResponse {

    private Long id;
    private String badgeText;
    private String introText;
    private String location;
    private String email;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
    private String formTitle;
    private String formDescription;
    private String namePlaceholder;
    private String emailPlaceholder;
    private String subjectPlaceholder;
    private String messagePlaceholder;
    private String submitButtonText;
    private LocalDateTime updatedAt;
}
