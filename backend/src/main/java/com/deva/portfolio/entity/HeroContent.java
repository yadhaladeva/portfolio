package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing the dynamic configuration and content of the portfolio Hero section.
 */
@Entity
@Table(name = "hero_content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeroContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String greeting = "Hi, I'm";

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String name = "Deva Yadhala";

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String role = "Software Developer";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "primary_button_text", nullable = false, length = 50)
    @Builder.Default
    private String primaryButtonText = "View Resume";

    @Column(name = "primary_button_visible", nullable = false)
    @Builder.Default
    private Boolean primaryButtonVisible = true;

    @Column(name = "secondary_button_text", nullable = false, length = 50)
    @Builder.Default
    private String secondaryButtonText = "Contact Me";

    @Column(name = "secondary_button_visible", nullable = false)
    @Builder.Default
    private Boolean secondaryButtonVisible = true;

    @Column(name = "github_url", length = 300)
    @Builder.Default
    private String githubUrl = "https://github.com";

    @Column(name = "linkedin_url", length = 300)
    @Builder.Default
    private String linkedinUrl = "https://linkedin.com";

    @Column(length = 300)
    @Builder.Default
    private String quote = "Think deeper. Build smarter. Solve better.";

    @Column(name = "quote_visible", nullable = false)
    @Builder.Default
    private Boolean quoteVisible = true;

    @OneToMany(mappedBy = "heroContent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<HeroStage> stages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addStage(HeroStage stage) {
        stages.add(stage);
        stage.setHeroContent(this);
    }

    public void removeStage(HeroStage stage) {
        stages.remove(stage);
        stage.setHeroContent(null);
    }

    public void clearStages() {
        for (HeroStage stage : new ArrayList<>(stages)) {
            removeStage(stage);
        }
    }
}
