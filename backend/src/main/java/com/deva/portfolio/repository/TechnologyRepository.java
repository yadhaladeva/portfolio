package com.deva.portfolio.repository;

import com.deva.portfolio.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TechnologyRepository extends JpaRepository<Technology, Long> {
    Optional<Technology> findByNameIgnoreCase(String name);
    Set<Technology> findByNameInIgnoreCase(Collection<String> names);
    List<Technology> findAllByOrderByNameAsc();
}
