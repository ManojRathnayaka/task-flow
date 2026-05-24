package com.taskmanager.dto.request;

import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

/**
 * TaskRequest DTO — carries task create/update data.
 *
 * <p><b>S Principle</b>: Only responsible for transporting task input.
 * Defaults (e.g., status=TODO if null) are applied in TaskMapper, not here.
 */
public class TaskRequest {

    private static final Logger log = LoggerFactory.getLogger(TaskRequest.class);

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    /** If null, defaults to TODO in TaskMapper */
    private TaskStatus status;

    /** If null, defaults to MEDIUM in TaskMapper */
    private TaskPriority priority;

    private LocalDate dueDate;

    public TaskRequest() {
    }

    public TaskRequest(String title, String description, TaskStatus status, TaskPriority priority, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public static TaskRequestBuilder builder() {
        return new TaskRequestBuilder();
    }

    public static class TaskRequestBuilder {
        private String title;
        private String description;
        private TaskStatus status;
        private TaskPriority priority;
        private LocalDate dueDate;

        TaskRequestBuilder() {
        }

        public TaskRequestBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TaskRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TaskRequestBuilder status(TaskStatus status) {
            this.status = status;
            return this;
        }

        public TaskRequestBuilder priority(TaskPriority priority) {
            this.priority = priority;
            return this;
        }

        public TaskRequestBuilder dueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TaskRequest build() {
            return new TaskRequest(title, description, status, priority, dueDate);
        }
    }
}
