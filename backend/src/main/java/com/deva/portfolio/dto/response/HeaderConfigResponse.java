package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderConfigResponse {

    private Long id;
    private String logoText;
    private String brandName;

    @Builder.Default
    private List<HeaderNavItemResponse> navItems = new ArrayList<>();
}
