package com.deva.portfolio.security;

import com.deva.portfolio.entity.AdminUser;
import com.deva.portfolio.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Custom UserDetailsService to authenticate AdminUser by either username or email.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        AdminUser admin = adminUserRepository.findByUsername(usernameOrEmail)
                .or(() -> adminUserRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + usernameOrEmail));

        return new User(
                admin.getUsername(),
                admin.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority(admin.getRole()))
        );
    }
}
