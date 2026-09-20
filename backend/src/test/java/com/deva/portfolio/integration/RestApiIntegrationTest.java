package com.deva.portfolio.integration;

import com.deva.portfolio.dto.request.ContactMessageRequest;
import com.deva.portfolio.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RestApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("Public GET /api/projects is accessible without authentication")
    void testPublicProjectsEndpoint() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Public GET /api/skills and /api/skills/grouped are accessible without authentication")
    void testPublicSkillsEndpoints() throws Exception {
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        mockMvc.perform(get("/api/skills/grouped"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Public GET /api/experience and /api/certifications are accessible without authentication")
    void testPublicExperienceAndCertifications() throws Exception {
        mockMvc.perform(get("/api/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/certifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Public POST /api/contact submits message without authentication")
    void testPublicContactSubmission() throws Exception {
        ContactMessageRequest request = ContactMessageRequest.builder()
                .name("Jane Recruiter")
                .email("jane.recruiter@example.com")
                .subject("Software Engineering Role at TechCorp")
                .message("Hi Deva, we are impressed by your full-stack portfolio.")
                .build();

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").isNumber())
                .andExpect(jsonPath("$.data.name").value("Jane Recruiter"));
    }

    @Test
    @DisplayName("Protected GET /api/admin/stats is blocked without JWT token")
    void testProtectedAdminStatsBlockedWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Protected GET /api/admin/stats succeeds with valid JWT Bearer token")
    void testProtectedAdminStatsAllowedWithValidJwt() throws Exception {
        String token = jwtTokenProvider.generateTokenFromUsername("testadmin");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProjects").isNumber())
                .andExpect(jsonPath("$.data.totalSkills").isNumber());
    }

    @Test
    @DisplayName("OpenAPI docs (/v3/api-docs) is publicly accessible for Swagger UI")
    void testOpenApiDocsPubliclyAccessible() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Root URL (/) redirects to Swagger UI")
    void testRootRedirectToSwagger() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection());
    }
}
