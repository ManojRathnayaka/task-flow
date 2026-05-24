package com.taskmanager.service;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;

import java.util.List;

/**
 * TaskService — contract for task CRUD operations.
 *
 * <p><b>I Principle</b>: Segregated from AuthService and UserService — consumers
 * that only need task operations don't get burdened with auth or user methods.
 *
 * <p><b>D Principle</b>: TaskController depends on this abstraction.
 * Spring injects the appropriate implementation at runtime.
 *
 * <p><b>O Principle</b>: A caching implementation or read-replica implementation
 * can be introduced without modifying TaskController.
 *
 * <p><b>L Principle</b>: Any implementation of this interface can substitute
 * another anywhere TaskService is expected.
 */
public interface TaskService {

    /**
     * Returns all tasks owned by a user.
     *
     * @param userId the authenticated user's ID
     */
    List<TaskResponse> getAllTasksForUser(Long userId);

    /**
     * Returns tasks filtered by status for a user.
     */
    List<TaskResponse> getTasksByStatus(Long userId, TaskStatus status);

    /**
     * Returns tasks filtered by priority for a user.
     */
    List<TaskResponse> getTasksByPriority(Long userId, TaskPriority priority);

    /**
     * Returns a single task by ID, only if it belongs to the given user.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if not found or unauthorized
     */
    TaskResponse getTaskById(Long taskId, Long userId);

    /**
     * Creates a new task for the given user.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if user not found
     */
    TaskResponse createTask(TaskRequest request, Long userId);

    /**
     * Updates an existing task owned by the given user.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if task not found or unauthorized
     */
    TaskResponse updateTask(Long taskId, TaskRequest request, Long userId);

    /**
     * Deletes a task owned by the given user.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if task not found or unauthorized
     */
    void deleteTask(Long taskId, Long userId);
}
