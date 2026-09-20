package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing career history, work experience, and internships.
 */
@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String organization;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(length = 100)
    private String location;

    @Column(name = "start_date", nullable = false, length = 50)
    private String startDate;

    @Column(name = "end_date", length = 50)
    private String endDate; // e.g. "Present" or "Dec 2025"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
