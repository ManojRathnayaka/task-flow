package com.taskmanager.security;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * CustomUserDetailsService — loads user details for Spring Security.
 *
 * <p><b>S Principle</b>: Single responsibility — load a {@link UserDetails} object
 * from the database, given a username. Nothing else.
 *
 * <p><b>D Principle</b>: Implements Spring Security's {@code UserDetailsService} interface,
 * which is the abstraction AuthenticationManager depends on. Spring Security never
 * directly accesses our User entity or UserRepository.
 *
 * <p><b>L Principle</b>: This class is substitutable wherever UserDetailsService is expected.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a user by username for Spring Security's authentication process.
     *
     * @param username the username to look up
     * @return a UserDetails object (Spring Security's representation)
     * @throws UsernameNotFoundException if no user with that username exists
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Build Spring Security's UserDetails — with empty authorities for simplicity
        // Role-based access control can be added by populating authorities here
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }
}
