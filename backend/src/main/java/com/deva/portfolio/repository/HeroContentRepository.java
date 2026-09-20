package com.deva.portfolio.repository;

import com.deva.portfolio.entity.HeroContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeroContentRepository extends JpaRepository<HeroContent, Long> {
    Optional<HeroContent> findFirstByOrderByIdAsc();
}
