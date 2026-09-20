package com.deva.portfolio.repository;

import com.deva.portfolio.entity.AboutEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutEducationRepository extends JpaRepository<AboutEducation, Long> {

    List<AboutEducation> findByAboutContentIdOrderByDisplayOrderAsc(Long aboutContentId);
}
