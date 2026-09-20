package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "section_header_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionHeaderConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_key", nullable = false, unique = true, length = 50)
    private String sectionKey; // e.g. "SKILLS", "EXPERIENCE", "PROJECTS", "CERTIFICATIONS", "CONTACT"

    @Column(name = "badge_text", nullable = false, length = 100)
    private String badgeText;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
