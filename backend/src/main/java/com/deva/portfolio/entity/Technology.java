package com.deva.portfolio.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Master entity for normalized project technologies (e.g., Java, Spring Boot, PostgreSQL, etc.).
 * Enables relational mapping and future multi-tag filtering without un-normalized comma-separated strings.
 */
@Entity
@Table(name = "technologies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    @Column(length = 60)
    private String category;
}
