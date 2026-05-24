package com.taskmanager.mapper;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.model.Task;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import org.springframework.stereotype.Component;

/**
 * TaskMapper — converts between Task entity and its DTOs.
 *
 * <p><b>S Principle</b>: This class has exactly ONE responsibility — mapping.
 * It knows about both the entity structure and DTO structure, so that neither
 * TaskServiceImpl nor the controllers need to.
 *
 * <p>By injecting TaskMapper as a Spring bean, consumers depend on it via
 * constructor injection, honoring the <b>D Principle</b>.
 */
@Component
public class TaskMapper {

    /**
     * Converts a Task entity to its response DTO.
     * The user field is intentionally excluded (not exposed in responses).
     */
    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    /**
     * Converts a TaskRequest DTO to a new Task entity.
     * Defaults are applied here: status → TODO, priority → MEDIUM.
     */
    public Task toEntity(TaskRequest request) {
        return Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .build();
    }

    /**
     * Updates an existing Task entity in-place from a TaskRequest DTO.
     * Only non-null fields from the request are applied.
     */
    public void updateEntity(Task task, TaskRequest request) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
    }
}
