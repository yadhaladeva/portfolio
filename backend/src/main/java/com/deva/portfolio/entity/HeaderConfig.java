package com.deva.portfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing the Header / Navigation configuration in the portfolio CMS.
 */
@Entity
@Table(name = "header_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeaderConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Logo monogram text is required")
    @Column(name = "logo_text", nullable = false, length = 20)
    private String logoText;

    @NotBlank(message = "Brand name is required")
    @Column(name = "brand_name", nullable = false, length = 100)
    private String brandName;

    @OneToMany(mappedBy = "headerConfig", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<HeaderNavItem> navItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void addNavItem(HeaderNavItem item) {
        navItems.add(item);
        item.setHeaderConfig(this);
    }

    public void removeNavItem(HeaderNavItem item) {
        navItems.remove(item);
        item.setHeaderConfig(null);
    }

    public void clearNavItems() {
        navItems.clear();
    }
}
