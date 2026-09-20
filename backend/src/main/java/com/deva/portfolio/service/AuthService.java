package com.deva.portfolio.service;

import com.deva.portfolio.dto.request.LoginRequest;
import com.deva.portfolio.dto.response.AuthResponse;
import com.deva.portfolio.entity.AdminUser;
import com.deva.portfolio.exception.ApiException;
import com.deva.portfolio.repository.AdminUserRepository;
import com.deva.portfolio.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AdminUserRepository adminUserRepository;

    @Transactional(readOnly = true)
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        // Authenticate against Spring Security DaoAuthenticationProvider
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail().trim(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        String principalUsername = authentication.getName();
        AdminUser admin = adminUserRepository.findByUsername(principalUsername)
                .or(() -> adminUserRepository.findByEmail(principalUsername))
                .orElseThrow(() -> new ApiException("User not found after authentication", HttpStatus.UNAUTHORIZED));

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresInMs(tokenProvider.getExpirationMs())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .role(admin.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUser getCurrentUser(String username) {
        return adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
