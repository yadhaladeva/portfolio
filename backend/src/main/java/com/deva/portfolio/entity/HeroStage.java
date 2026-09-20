package com.deva.portfolio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing an individual value proposition / philosophy stage in the Hero section.
 */
@Entity
@Table(name = "hero_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeroStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stage_number", nullable = false, length = 30)
    private String stageNumber;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String icon = "Brain";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String accent = "cyan";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hero_content_id")
    @JsonIgnore
    private HeroContent heroContent;
}
