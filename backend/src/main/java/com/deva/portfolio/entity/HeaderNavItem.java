package com.deva.portfolio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Entity representing an individual navigation item in the header navbar.
 */
@Entity
@Table(name = "header_nav_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeaderNavItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "header_config_id", nullable = false)
    @JsonIgnore
    private HeaderConfig headerConfig;

    @NotBlank(message = "Navigation item name is required")
    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "section_id", length = 50)
    private String sectionId;

    @Column(length = 255)
    private String href;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;

    @Column(name = "is_external", nullable = false)
    @Builder.Default
    private Boolean isExternal = false;
}
