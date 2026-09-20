package com.deva.portfolio.repository;

import com.deva.portfolio.entity.AboutContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AboutContentRepository extends JpaRepository<AboutContent, Long> {

    Optional<AboutContent> findFirstByOrderByIdAsc();
}
