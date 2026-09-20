package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a technical or soft skill grouped by category.
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 60)
    private String category; // e.g. Programming, Framework, Web, Database, Tools, Soft skills

    @Column(nullable = false)
    @Builder.Default
    private Integer proficiency = 85; // Integer score 0 - 100 for visual bars/badges

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
