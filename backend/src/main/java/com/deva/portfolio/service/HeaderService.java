package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.HeaderConfigRequest;
import com.deva.portfolio.dto.request.HeaderNavItemRequest;
import com.deva.portfolio.dto.response.HeaderConfigResponse;
import com.deva.portfolio.dto.response.HeaderNavItemResponse;
import com.deva.portfolio.entity.HeaderConfig;
import com.deva.portfolio.entity.HeaderNavItem;
import com.deva.portfolio.repository.HeaderConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HeaderService {

    private final HeaderConfigRepository headerConfigRepository;

    @Transactional(readOnly = true)
    public HeaderConfigResponse getHeaderConfig() {
        HeaderConfig config = headerConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultHeaderConfig);
        return mapToResponse(config);
    }

    @Transactional
    public HeaderConfigResponse updateHeaderConfig(HeaderConfigRequest request) {
        HeaderConfig config = headerConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultHeaderConfig);

        config.setLogoText(request.getLogoText() != null ? request.getLogoText().trim() : "DY");
        config.setBrandName(request.getBrandName() != null ? request.getBrandName().trim() : "Deva Yadhala");

        // Clear existing nav items
        config.clearNavItems();

        if (request.getNavItems() != null && !request.getNavItems().isEmpty()) {
            int order = 1;
            for (HeaderNavItemRequest itemReq : request.getNavItems()) {
                String name = itemReq.getName() != null ? itemReq.getName().trim() : "";
                boolean isExt = Boolean.TRUE.equals(itemReq.getIsExternal());
                String sectionId = itemReq.getSectionId() != null ? itemReq.getSectionId().trim().toLowerCase() : "";
                
                String href = itemReq.getHref();
                if (!isExt) {
                    if (sectionId.isEmpty()) {
                        sectionId = name.toLowerCase().replaceAll("[^a-z0-9]", "");
                    }
                    href = "#" + sectionId;
                } else if (href == null || href.isBlank()) {
                    href = "#";
                }

                HeaderNavItem navItem = HeaderNavItem.builder()
                        .name(name)
                        .sectionId(sectionId)
                        .href(href)
                        .displayOrder(itemReq.getDisplayOrder() != null ? itemReq.getDisplayOrder() : order)
                        .visible(itemReq.getVisible() != null ? itemReq.getVisible() : true)
                        .isExternal(isExt)
                        .build();

                config.addNavItem(navItem);
                order++;
            }
        }

        HeaderConfig saved = headerConfigRepository.save(config);
        log.info("Header navigation configuration updated successfully ({} nav items).", saved.getNavItems().size());
        return mapToResponse(saved);
    }

    @Transactional
    public HeaderConfigResponse resetToDefaults() {
        HeaderConfig config = headerConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultHeaderConfig);

        config.setLogoText("DY");
        config.setBrandName("Deva Yadhala");

        config.clearNavItems();

        config.addNavItem(HeaderNavItem.builder()
                .name("About")
                .sectionId("about")
                .href("#about")
                .displayOrder(1)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Skills")
                .sectionId("skills")
                .href("#skills")
                .displayOrder(2)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Experience")
                .sectionId("experience")
                .href("#experience")
                .displayOrder(3)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Projects")
                .sectionId("projects")
                .href("#projects")
                .displayOrder(4)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Certifications")
                .sectionId("certifications")
                .href("#certifications")
                .displayOrder(5)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Contact")
                .sectionId("contact")
                .href("#contact")
                .displayOrder(6)
                .visible(true)
                .isExternal(false)
                .build());

        HeaderConfig saved = headerConfigRepository.save(config);
        log.info("Header configuration reset to canonical defaults.");
        return mapToResponse(saved);
    }

    @Transactional
    public HeaderConfig createDefaultHeaderConfig() {
        HeaderConfig config = HeaderConfig.builder()
                .logoText("DY")
                .brandName("Deva Yadhala")
                .build();

        config.addNavItem(HeaderNavItem.builder()
                .name("About")
                .sectionId("about")
                .href("#about")
                .displayOrder(1)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Skills")
                .sectionId("skills")
                .href("#skills")
                .displayOrder(2)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Experience")
                .sectionId("experience")
                .href("#experience")
                .displayOrder(3)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Projects")
                .sectionId("projects")
                .href("#projects")
                .displayOrder(4)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Certifications")
                .sectionId("certifications")
                .href("#certifications")
                .displayOrder(5)
                .visible(true)
                .isExternal(false)
                .build());

        config.addNavItem(HeaderNavItem.builder()
                .name("Contact")
                .sectionId("contact")
                .href("#contact")
                .displayOrder(6)
                .visible(true)
                .isExternal(false)
                .build());

        return headerConfigRepository.save(config);
    }

    private HeaderConfigResponse mapToResponse(HeaderConfig entity) {
        if (entity == null) {
            return null;
        }

        List<HeaderNavItemResponse> navItemResponses = new ArrayList<>();
        if (entity.getNavItems() != null) {
            navItemResponses = entity.getNavItems().stream()
                    .sorted(Comparator.comparing(HeaderNavItem::getDisplayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .map(item -> HeaderNavItemResponse.builder()
                            .id(item.getId())
                            .name(item.getName())
                            .sectionId(item.getSectionId())
                            .href(item.getHref())
                            .displayOrder(item.getDisplayOrder())
                            .visible(item.getVisible())
                            .isExternal(item.getIsExternal())
                            .build())
                    .collect(Collectors.toList());
        }

        return HeaderConfigResponse.builder()
                .id(entity.getId())
                .logoText(entity.getLogoText())
                .brandName(entity.getBrandName())
                .navItems(navItemResponses)
                .build();
    }
}
