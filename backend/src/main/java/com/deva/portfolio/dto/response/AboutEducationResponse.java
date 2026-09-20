package com.deva.portfolio.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutEducationResponse {

    private Long id;
    private String degree;
    private String institution;
    private String startYear;
    private String endYear;
    private String cgpa;
    private String highlight;
    private Integer displayOrder;
    private Boolean visible;
}
