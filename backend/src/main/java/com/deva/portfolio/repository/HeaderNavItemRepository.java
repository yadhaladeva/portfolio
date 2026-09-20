package com.deva.portfolio.repository;

import com.deva.portfolio.entity.HeaderNavItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeaderNavItemRepository extends JpaRepository<HeaderNavItem, Long> {

    List<HeaderNavItem> findByHeaderConfigIdOrderByDisplayOrderAsc(Long headerConfigId);
}
