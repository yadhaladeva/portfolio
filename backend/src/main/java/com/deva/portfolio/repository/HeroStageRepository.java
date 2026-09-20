package com.deva.portfolio.repository;

import com.deva.portfolio.entity.HeroStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeroStageRepository extends JpaRepository<HeroStage, Long> {
    List<HeroStage> findByHeroContentIdOrderByDisplayOrderAsc(Long heroContentId);
}
