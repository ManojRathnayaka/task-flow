package com.taskmanager.controller;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.model.User;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.service.TaskService;
import com.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TaskController — HTTP layer for task CRUD endpoints.
 *
 * <p><b>S Principle</b>: Only parses HTTP requests, extracts the authenticated user,
 * delegates to TaskService, and returns API responses. No business logic.
 *
 * <p><b>D Principle</b>: Depends on TaskService and UserService interfaces.
 * Never directly imports TaskServiceImpl or UserServiceImpl.
 *
 * <p>The authenticated user is extracted from Spring Security's context via
 * {@code @AuthenticationPrincipal}, which was set by JwtAuthenticationFilter.
 */
@RestController
@RequestMapping("/api/tasks")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "Task CRUD — all endpoints require JWT authentication")
public class TaskController {

    // D Principle: interface injection, not concrete class
    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get all tasks",
               description = "Returns all tasks for the authenticated user. Optionally filter by status or priority.")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority) {

        Long userId = resolveUserId(userDetails);
        List<TaskResponse> tasks;

        if (status != null) {
            tasks = taskService.getTasksByStatus(userId, status);
        } else if (priority != null) {
            tasks = taskService.getTasksByPriority(userId, priority);
        } else {
            tasks = taskService.getAllTasksForUser(userId);
        }

        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved successfully", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        TaskResponse task = taskService.getTaskById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved successfully", task));
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        TaskResponse task = taskService.createTask(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        TaskResponse task = taskService.updateTask(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = resolveUserId(userDetails);
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    /**
     * Resolves the authenticated user's database ID from their Spring Security principal.
     * Extracted as a private helper to avoid code duplication across handler methods.
     */
    private Long resolveUserId(UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        return user.getId();
    }
}
