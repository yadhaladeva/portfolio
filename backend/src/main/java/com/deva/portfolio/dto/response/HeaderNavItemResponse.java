package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderNavItemResponse {

    private Long id;
    private String name;
    private String sectionId;
    private String href;
    private Integer displayOrder;
    private Boolean visible;
    private Boolean isExternal;
}
