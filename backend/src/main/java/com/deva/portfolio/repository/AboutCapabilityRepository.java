package com.deva.portfolio.repository;

import com.deva.portfolio.entity.AboutCapability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutCapabilityRepository extends JpaRepository<AboutCapability, Long> {

    List<AboutCapability> findByAboutContentIdOrderByDisplayOrderAsc(Long aboutContentId);
}
