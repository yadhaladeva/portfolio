package com.deva.portfolio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing an education entry (e.g. B.Tech, future M.Tech, MBA, etc.) in the About section.
 */
@Entity
@Table(name = "about_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "about_content_id", nullable = false)
    @JsonIgnore
    private AboutContent aboutContent;

    @NotBlank(message = "Degree name is required")
    @Column(nullable = false, length = 150)
    private String degree;

    @NotBlank(message = "Institution is required")
    @Column(nullable = false, length = 200)
    private String institution;

    @NotBlank(message = "Start year is required")
    @Column(name = "start_year", nullable = false, length = 10)
    private String startYear;

    @Column(name = "end_year", length = 10)
    private String endYear;

    @Column(length = 20)
    private String cgpa;

    @Column(length = 100)
    private String highlight;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
