package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * TaskRepository — data access for Task entities.
 *
 * <p>Spring Data JPA derives query implementations from method names at runtime,
 * following the <b>O Principle</b>: new query methods can be added without
 * modifying any existing repository methods or consumer classes.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** Fetch all tasks belonging to a specific user */
    List<Task> findByUserId(Long userId);

    /** Filter tasks by status for a user */
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);

    /** Filter tasks by priority for a user */
    List<Task> findByUserIdAndPriority(Long userId, TaskPriority priority);

    /**
     * Find a task by its ID only if it belongs to the given user.
     * This enforces ownership at the repository level — no task from another user
     * can ever be returned to the calling service.
     */
    Optional<Task> findByIdAndUserId(Long id, Long userId);
}
