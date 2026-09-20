package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Header Content
    @Column(nullable = false, length = 100)
    @Builder.Default
    private String badgeText = "GET IN TOUCH";

    @Column(nullable = false, length = 500)
    @Builder.Default
    private String introText = "Open to software engineering, backend development, and technical collaboration opportunities.";

    // Contact Information
    @Column(nullable = false, length = 150)
    @Builder.Default
    private String location = "Chennai, India";

    @Column(nullable = false, length = 150)
    @Builder.Default
    private String email = "devayadhala.dev@gmail.com";

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    @Builder.Default
    private String linkedinUrl = "https://linkedin.com";

    @Column(length = 255)
    @Builder.Default
    private String githubUrl = "https://github.com";

    // Form Configuration
    @Column(nullable = false, length = 100)
    @Builder.Default
    private String formTitle = "Send a Message";

    @Column(nullable = false, length = 500)
    @Builder.Default
    private String formDescription = "Fill in your contact details below to send an inquiry directly to my portfolio database.";

    @Column(length = 100)
    @Builder.Default
    private String namePlaceholder = "e.g. John Doe";

    @Column(length = 100)
    @Builder.Default
    private String emailPlaceholder = "e.g. john@company.com";

    @Column(length = 150)
    @Builder.Default
    private String subjectPlaceholder = "e.g. Job opportunity / Collaboration";

    @Column(length = 150)
    @Builder.Default
    private String messagePlaceholder = "Write your message here...";

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String submitButtonText = "Send Message";

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
