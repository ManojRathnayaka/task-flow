package com.taskmanager.controller;

import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.model.User;
import com.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * UserController — HTTP layer for user profile endpoints.
 *
 * <p><b>S Principle</b>: Handles only user profile HTTP operations.
 * Authentication is in AuthController, task management in TaskController.
 *
 * <p><b>I Principle</b>: Injects only UserService (the minimal interface it needs),
 * not a large combined service class.
 */
@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User profile endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile",
               description = "Returns the authenticated user's profile and task count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername());

        Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "taskCount", user.getTasks().size()
        );

        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }
}
