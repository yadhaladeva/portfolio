package com.deva.portfolio.integration;

import com.deva.portfolio.dto.request.LoginRequest;
import com.deva.portfolio.entity.AdminUser;
import com.deva.portfolio.repository.AdminUserRepository;
import com.deva.portfolio.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JwtAuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final String TEST_USERNAME = "testadmin";
    private static final String TEST_PASSWORD = "testpassword123";
    private static final String TEST_EMAIL = "testadmin@example.com";

    @BeforeEach
    void setUp() {
        if (adminUserRepository.findByUsername(TEST_USERNAME).isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username(TEST_USERNAME)
                    .email(TEST_EMAIL)
                    .passwordHash(passwordEncoder.encode(TEST_PASSWORD))
                    .role("ROLE_ADMIN")
                    .build();
            adminUserRepository.save(admin);
        }
    }

    @Test
    @DisplayName("POST /api/auth/login with valid credentials generates signed JWT")
    void testSuccessfulAdminLogin() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail(TEST_USERNAME)
                .password(TEST_PASSWORD)
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.username").value(TEST_USERNAME))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(result.getResponse().getContentAsString());
        String token = responseNode.path("data").path("token").asText();

        assertTrue(jwtTokenProvider.validateToken(token), "Generated JWT token must be valid");
        assertEquals(TEST_USERNAME, jwtTokenProvider.getUsernameFromJwt(token));
    }

    @Test
    @DisplayName("POST /api/auth/login with invalid password returns unauthorized/forbidden")
    void testFailedLoginWithWrongPassword() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail(TEST_USERNAME)
                .password("wrongpassword!")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me with valid Bearer token returns authenticated user profile")
    void testGetCurrentUserWithValidJwt() throws Exception {
        String token = jwtTokenProvider.generateTokenFromUsername(TEST_USERNAME);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value(TEST_USERNAME))
                .andExpect(jsonPath("$.data.email").value(TEST_EMAIL));
    }

    @Test
    @DisplayName("GET /api/auth/me without token returns 401/403")
    void testGetCurrentUserWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me with tampered token returns 401/403")
    void testGetCurrentUserWithTamperedToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature"))
                .andExpect(status().isUnauthorized());
    }
}
