package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.SkillRequest;
import com.deva.portfolio.dto.response.SkillGroupResponse;
import com.deva.portfolio.dto.response.SkillResponse;
import com.deva.portfolio.entity.Skill;
import com.deva.portfolio.exception.ResourceNotFoundException;
import com.deva.portfolio.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(SkillResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SkillGroupResponse> getSkillsGroupedByCategory() {
        List<Skill> allSkills = skillRepository.findAllByOrderByDisplayOrderAsc();

        // Preserve logical category order: Programming, Framework, Web, Database, Tools, Soft skills
        List<String> preferredOrder = List.of(
                "Programming", "Framework", "Web", "Database", "Tools", "Soft skills"
        );

        Map<String, List<SkillResponse>> grouped = allSkills.stream()
                .map(SkillResponse::fromEntity)
                .collect(Collectors.groupingBy(
                        SkillResponse::getCategory,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        return grouped.entrySet().stream()
                .map(entry -> SkillGroupResponse.builder()
                        .category(entry.getKey())
                        .skills(entry.getValue())
                        .build())
                .sorted(Comparator.comparingInt(g -> {
                    int index = preferredOrder.indexOf(g.getCategory());
                    return index >= 0 ? index : 999;
                }))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return SkillResponse.fromEntity(skill);
    }

    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        Skill skill = Skill.builder()
                .name(request.getName().trim())
                .category(request.getCategory().trim())
                .proficiency(request.getProficiency() != null ? request.getProficiency() : 85)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        Skill saved = skillRepository.save(skill);
        return SkillResponse.fromEntity(saved);
    }

    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));

        skill.setName(request.getName().trim());
        skill.setCategory(request.getCategory().trim());
        if (request.getProficiency() != null) {
            skill.setProficiency(request.getProficiency());
        }
        if (request.getDisplayOrder() != null) {
            skill.setDisplayOrder(request.getDisplayOrder());
        }

        Skill updated = skillRepository.save(skill);
        return SkillResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        skillRepository.delete(skill);
    }
}
