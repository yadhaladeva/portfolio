package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.ContactSettingsRequest;
import com.deva.portfolio.dto.response.ContactSettingsResponse;
import com.deva.portfolio.entity.ContactSettings;
import com.deva.portfolio.repository.ContactSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactSettingsService {

    private final ContactSettingsRepository contactSettingsRepository;

    @Transactional
    public ContactSettings getOrCreateDefaultSettings() {
        return contactSettingsRepository.findFirstByOrderByIdAsc().orElseGet(() -> {
            log.info("No ContactSettings found. Initializing canonical default contact configuration.");
            ContactSettings defaultSettings = ContactSettings.builder()
                    .badgeText("GET IN TOUCH")
                    .introText("Open to software engineering, backend development, and technical collaboration opportunities.")
                    .location("Chennai, India")
                    .email("devayadhala.dev@gmail.com")
                    .phone(null)
                    .linkedinUrl("https://linkedin.com")
                    .githubUrl("https://github.com")
                    .formTitle("Send a Message")
                    .formDescription("Fill in your contact details below to send an inquiry directly to my portfolio database.")
                    .namePlaceholder("e.g. John Doe")
                    .emailPlaceholder("e.g. john@company.com")
                    .subjectPlaceholder("e.g. Job opportunity / Collaboration")
                    .messagePlaceholder("Write your message here...")
                    .submitButtonText("Send Message")
                    .build();
            return contactSettingsRepository.save(defaultSettings);
        });
    }

    @Transactional(readOnly = true)
    public ContactSettingsResponse getContactSettings() {
        ContactSettings settings = contactSettingsRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    // Fallback to in-memory defaults if not yet persisted
                    return ContactSettings.builder()
                            .badgeText("GET IN TOUCH")
                            .introText("Open to software engineering, backend development, and technical collaboration opportunities.")
                            .location("Chennai, India")
                            .email("devayadhala.dev@gmail.com")
                            .phone(null)
                            .linkedinUrl("https://linkedin.com")
                            .githubUrl("https://github.com")
                            .formTitle("Send a Message")
                            .formDescription("Fill in your contact details below to send an inquiry directly to my portfolio database.")
                            .namePlaceholder("e.g. John Doe")
                            .emailPlaceholder("e.g. john@company.com")
                            .subjectPlaceholder("e.g. Job opportunity / Collaboration")
                            .messagePlaceholder("Write your message here...")
                            .submitButtonText("Send Message")
                            .build();
                });
        return mapToResponse(settings);
    }

    @Transactional
    public ContactSettingsResponse updateContactSettings(ContactSettingsRequest request) {
        ContactSettings settings = getOrCreateDefaultSettings();

        settings.setBadgeText(request.getBadgeText().trim());
        settings.setIntroText(request.getIntroText().trim());
        settings.setLocation(request.getLocation().trim());
        settings.setEmail(request.getEmail().trim());
        settings.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        settings.setLinkedinUrl(request.getLinkedinUrl() != null ? request.getLinkedinUrl().trim() : "https://linkedin.com");
        settings.setGithubUrl(request.getGithubUrl() != null ? request.getGithubUrl().trim() : "https://github.com");

        settings.setFormTitle(request.getFormTitle().trim());
        settings.setFormDescription(request.getFormDescription().trim());
        settings.setNamePlaceholder(request.getNamePlaceholder() != null ? request.getNamePlaceholder().trim() : "e.g. John Doe");
        settings.setEmailPlaceholder(request.getEmailPlaceholder() != null ? request.getEmailPlaceholder().trim() : "e.g. john@company.com");
        settings.setSubjectPlaceholder(request.getSubjectPlaceholder() != null ? request.getSubjectPlaceholder().trim() : "e.g. Job opportunity / Collaboration");
        settings.setMessagePlaceholder(request.getMessagePlaceholder() != null ? request.getMessagePlaceholder().trim() : "Write your message here...");
        settings.setSubmitButtonText(request.getSubmitButtonText().trim());

        ContactSettings saved = contactSettingsRepository.save(settings);
        log.info("ContactSettings updated successfully by admin.");
        return mapToResponse(saved);
    }

    @Transactional
    public ContactSettingsResponse resetToDefaults() {
        ContactSettings settings = getOrCreateDefaultSettings();

        settings.setBadgeText("GET IN TOUCH");
        settings.setIntroText("Open to software engineering, backend development, and technical collaboration opportunities.");
        settings.setLocation("Chennai, India");
        settings.setEmail("devayadhala.dev@gmail.com");
        settings.setPhone(null);
        settings.setLinkedinUrl("https://linkedin.com");
        settings.setGithubUrl("https://github.com");
        settings.setFormTitle("Send a Message");
        settings.setFormDescription("Fill in your contact details below to send an inquiry directly to my portfolio database.");
        settings.setNamePlaceholder("e.g. John Doe");
        settings.setEmailPlaceholder("e.g. john@company.com");
        settings.setSubjectPlaceholder("e.g. Job opportunity / Collaboration");
        settings.setMessagePlaceholder("Write your message here...");
        settings.setSubmitButtonText("Send Message");

        ContactSettings saved = contactSettingsRepository.save(settings);
        log.info("ContactSettings reset to canonical defaults.");
        return mapToResponse(saved);
    }

    private ContactSettingsResponse mapToResponse(ContactSettings settings) {
        return ContactSettingsResponse.builder()
                .id(settings.getId())
                .badgeText(settings.getBadgeText())
                .introText(settings.getIntroText())
                .location(settings.getLocation())
                .email(settings.getEmail())
                .phone(settings.getPhone())
                .linkedinUrl(settings.getLinkedinUrl())
                .githubUrl(settings.getGithubUrl())
                .formTitle(settings.getFormTitle())
                .formDescription(settings.getFormDescription())
                .namePlaceholder(settings.getNamePlaceholder())
                .emailPlaceholder(settings.getEmailPlaceholder())
                .subjectPlaceholder(settings.getSubjectPlaceholder())
                .messagePlaceholder(settings.getMessagePlaceholder())
                .submitButtonText(settings.getSubmitButtonText())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
