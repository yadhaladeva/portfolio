package com.deva.portfolio.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionHeaderResponse {

    private String sectionKey;
    private String badgeText;
    private String description;
    private LocalDateTime updatedAt;
}
