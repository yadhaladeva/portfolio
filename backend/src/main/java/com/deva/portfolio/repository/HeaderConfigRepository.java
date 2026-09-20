package com.deva.portfolio.repository;

import com.deva.portfolio.entity.HeaderConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HeaderConfigRepository extends JpaRepository<HeaderConfig, Long> {

    Optional<HeaderConfig> findFirstByOrderByIdAsc();
}
