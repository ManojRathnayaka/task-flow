package com.taskmanager.controller;

import com.taskmanager.dto.request.LoginRequest;
import com.taskmanager.dto.request.RegisterRequest;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.dto.response.AuthResponse;
import com.taskmanager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — HTTP layer for authentication endpoints.
 *
 * <p><b>S Principle</b>: Handles HTTP concerns ONLY — parsing requests,
 * calling the service, and returning responses. Zero business logic here.
 *
 * <p><b>D Principle</b>: Injects {@code AuthService} interface.
 * The controller has NO knowledge of AuthServiceImpl's existence.
 * Spring wires the implementation at startup via @RequiredArgsConstructor.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register and login to get a JWT token")
public class AuthController {

    // D Principle: depends on interface, not concrete class
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account",
               description = "Creates a new user and returns a JWT token for immediate use")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with username and password",
               description = "Returns a JWT token valid for 24 hours")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
