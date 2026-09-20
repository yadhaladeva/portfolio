package com.deva.portfolio.controller.admin;

import com.deva.portfolio.dto.response.ApiResponse;
import com.deva.portfolio.entity.Technology;
import com.deva.portfolio.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller providing available technology tags.
 */
@RestController
@RequestMapping("/api/technologies")
@RequiredArgsConstructor
public class AdminTechnologyController {

    private final TechnologyRepository technologyRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Technology>>> getAllTechnologies() {
        return ResponseEntity.ok(ApiResponse.success(technologyRepository.findAllByOrderByNameAsc()));
    }
}
