package com.deva.portfolio.repository;

import com.deva.portfolio.entity.SectionHeaderConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectionHeaderRepository extends JpaRepository<SectionHeaderConfig, Long> {
    Optional<SectionHeaderConfig> findBySectionKeyIgnoreCase(String sectionKey);
}
