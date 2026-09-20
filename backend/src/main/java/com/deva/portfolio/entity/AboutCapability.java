package com.deva.portfolio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Entity representing an individual capability/highlight card in the About section.
 */
@Entity
@Table(name = "about_capabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutCapability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "about_content_id", nullable = false)
    @JsonIgnore
    private AboutContent aboutContent;

    @NotBlank(message = "Capability title is required")
    @Column(nullable = false, length = 100)
    private String title;

    @NotBlank(message = "Capability description is required")
    @Column(nullable = false, length = 255)
    private String description;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String icon = "Server";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String accent = "emerald";

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;
}
