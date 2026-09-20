package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutRoleResponse {

    private Long id;
    private String roleTitle;
    private String company;
    private String location;
    private String startDate;
    private String endDate;
    private Boolean current;
}
