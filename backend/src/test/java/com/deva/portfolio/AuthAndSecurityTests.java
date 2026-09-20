package com.deva.portfolio;

import com.deva.portfolio.dto.request.ContactMessageRequest;
import com.deva.portfolio.dto.request.LoginRequest;
import com.deva.portfolio.security.JwtTokenProvider;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class AuthAndSecurityTests {

    private JwtTokenProvider tokenProvider;
    private PasswordEncoder passwordEncoder;
    private Validator validator;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "test_jwt_secret_key_minimum_32_characters_long_for_unit_tests");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", 3600000L);

        passwordEncoder = new BCryptPasswordEncoder();

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testJwtGenerationAndValidation() {
        String username = "devayadhala";
        String token = tokenProvider.generateTokenFromUsername(username);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(username, tokenProvider.getUsernameFromJwt(token));
    }

    @Test
    void testBcryptPasswordHashing() {
        String rawPassword = "securePassword123!";
        String encoded = passwordEncoder.encode(rawPassword);

        assertNotNull(encoded);
        assertNotEquals(rawPassword, encoded);
        assertTrue(passwordEncoder.matches(rawPassword, encoded));
        assertFalse(passwordEncoder.matches("wrongPassword", encoded));
    }

    @Test
    void testLoginRequestValidation() {
        LoginRequest valid = LoginRequest.builder()
                .usernameOrEmail("admin")
                .password("password123")
                .build();
        assertTrue(validator.validate(valid).isEmpty());

        LoginRequest invalid = LoginRequest.builder()
                .usernameOrEmail("")
                .password("")
                .build();
        assertEquals(2, validator.validate(invalid).size());
    }

    @Test
    void testContactMessageValidation() {
        ContactMessageRequest valid = ContactMessageRequest.builder()
                .name("Recruiter Name")
                .email("recruiter@company.com")
                .subject("Software Developer Opportunity")
                .message("Hello Deva, we reviewed your portfolio and would like to connect.")
                .build();
        assertTrue(validator.validate(valid).isEmpty());

        ContactMessageRequest invalidEmail = ContactMessageRequest.builder()
                .name("Recruiter Name")
                .email("invalid-email-address")
                .subject("Opportunity")
                .message("Valid message")
                .build();
        assertFalse(validator.validate(invalidEmail).isEmpty());
    }
}
