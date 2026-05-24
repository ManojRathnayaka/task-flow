package com.taskmanager.model.enums;

/**
 * TaskStatus — represents the lifecycle state of a task.
 * Using an enum ensures only valid states are assignable (type safety, O principle).
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
