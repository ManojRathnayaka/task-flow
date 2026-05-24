package com.taskmanager.service.impl;

import com.taskmanager.dto.request.LoginRequest;
import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.AuthResponse;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.mapper.UserMapper;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtTokenProvider;
import com.taskmanager.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthServiceImpl — concrete implementation of AuthService.
 *
 * <p><b>S Principle</b>: Handles ONLY authentication business logic (register + login).
 * Password encoding, JWT generation, and DB access are all delegated to other classes.
 *
 * <p><b>L Principle</b>: This class is fully substitutable for AuthService everywhere
 * it is injected. AuthController never knows this concrete class exists.
 *
 * <p><b>D Principle</b>: All dependencies are injected as abstractions:
 * <ul>
 *   <li>{@code UserRepository} — JPA repository abstraction</li>
 *   <li>{@code PasswordEncoder} — Spring Security abstraction</li>
 *   <li>{@code JwtTokenProvider} — custom token abstraction</li>
 *   <li>{@code AuthenticationManager} — Spring Security abstraction</li>
 *   <li>{@code UserMapper} — mapping abstraction</li>
 * </ul>
 *
 * <p>Constructors generate dependency injection (preferred over field injection).
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
    }

    /**
     * Registers a new user:
     * 1. Validates uniqueness of username and email
     * 2. Encodes the password
     * 3. Saves the user entity
     * 4. Generates a JWT token
     * 5. Returns the auth response DTO
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hash
                .build();

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getUsername());
        return userMapper.toAuthResponse(saved, token);
    }

    /**
     * Authenticates an existing user:
     * 1. Delegates credential verification to Spring Security's AuthenticationManager
     * 2. Generates a JWT token for the authenticated user
     * 3. Loads the user entity from DB
     * 4. Returns the auth response DTO
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            String token = jwtTokenProvider.generateToken(auth.getName());
            User user = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new UnauthorizedException("User not found"));
            return userMapper.toAuthResponse(user, token);
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Invalid username or password");
        }
    }
}
