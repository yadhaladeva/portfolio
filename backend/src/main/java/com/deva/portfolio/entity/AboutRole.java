package com.deva.portfolio.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Entity representing the Current Role badge card in the About section.
 */
@Entity
@Table(name = "about_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "about_content_id", nullable = false)
    @JsonIgnore
    private AboutContent aboutContent;

    @NotBlank(message = "Role title is required")
    @Column(name = "role_title", nullable = false, length = 100)
    private String roleTitle;

    @NotBlank(message = "Company is required")
    @Column(nullable = false, length = 100)
    private String company;

    @Column(length = 100)
    private String location;

    @Column(name = "start_date", length = 30)
    private String startDate;

    @Column(name = "end_date", length = 30)
    private String endDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean current = true;
}
