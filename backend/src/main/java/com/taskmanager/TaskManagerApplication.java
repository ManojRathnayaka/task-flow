package com.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Task Manager Application Entry Point.
 *
 * <p>Demonstrates SOLID Principles throughout the codebase:
 * <ul>
 *   <li><b>S</b> — Each class has exactly one reason to change</li>
 *   <li><b>O</b> — Service implementations can be swapped without modifying consumers</li>
 *   <li><b>L</b> — Concrete implementations are fully substitutable for their interfaces</li>
 *   <li><b>I</b> — Small, focused interfaces (AuthService, TaskService, UserService)</li>
 *   <li><b>D</b> — Controllers depend on abstractions (interfaces), not concrete classes</li>
 * </ul>
 */
@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
