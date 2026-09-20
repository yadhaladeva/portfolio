package com.deva.portfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing the About section content and structure in the CMS.
 */
@Entity
@Table(name = "about_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Badge text is required")
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String badge = "ABOUT ME";

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 100)
    @Builder.Default
    private String title = "Career-Focused Summary";

    @NotBlank(message = "Career summary is required")
    @Column(name = "career_summary", columnDefinition = "TEXT", nullable = false)
    private String careerSummary;

    @NotBlank(message = "Experience summary is required")
    @Column(name = "experience_summary", columnDefinition = "TEXT", nullable = false)
    private String experienceSummary;

    @OneToMany(mappedBy = "aboutContent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<AboutCapability> capabilities = new ArrayList<>();

    @OneToMany(mappedBy = "aboutContent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<AboutEducation> education = new ArrayList<>();

    @OneToOne(mappedBy = "aboutContent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private AboutRole currentRole;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addCapability(AboutCapability capability) {
        capabilities.add(capability);
        capability.setAboutContent(this);
    }

    public void removeCapability(AboutCapability capability) {
        capabilities.remove(capability);
        capability.setAboutContent(null);
    }

    public void clearCapabilities() {
        capabilities.clear();
    }

    public void addEducation(AboutEducation edu) {
        education.add(edu);
        edu.setAboutContent(this);
    }

    public void removeEducation(AboutEducation edu) {
        education.remove(edu);
        edu.setAboutContent(null);
    }

    public void clearEducation() {
        education.clear();
    }

    public void setCurrentRole(AboutRole role) {
        this.currentRole = role;
        if (role != null) {
            role.setAboutContent(this);
        }
    }
}
