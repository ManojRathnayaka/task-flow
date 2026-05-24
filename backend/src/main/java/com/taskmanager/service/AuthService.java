package com.taskmanager.service;

import com.taskmanager.dto.request.LoginRequest;
import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.AuthResponse;

/**
 * AuthService — contract for authentication operations.
 *
 * <p><b>I Principle</b>: This interface is focused solely on auth operations.
 * It doesn't include user profile retrieval or task management — those are
 * in UserService and TaskService respectively.
 *
 * <p><b>D Principle</b>: AuthController depends on this interface, not on
 * AuthServiceImpl. This allows the implementation to change without modifying
 * the controller.
 *
 * <p><b>O Principle</b>: A new authentication method (e.g., OAuth2) can be
 * added by creating a new implementation — no existing code needs to change.
 */
public interface AuthService {

    /**
     * Registers a new user and returns a JWT token.
     *
     * @param request registration data (username, email, password)
     * @return AuthResponse containing the JWT and user info
     * @throws IllegalArgumentException if username or email is already taken
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request login credentials (username, password)
     * @return AuthResponse containing the JWT and user info
     * @throws com.taskmanager.exception.UnauthorizedException if credentials are invalid
     */
    AuthResponse login(LoginRequest request);
}
