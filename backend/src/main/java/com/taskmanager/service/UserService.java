package com.taskmanager.service;

import com.taskmanager.model.User;

/**
 * UserService — contract for user retrieval operations.
 *
 * <p><b>I Principle</b>: This interface is deliberately small and focused — only
 * user lookup operations. Authentication logic lives in AuthService, not here.
 * This prevents controllers from depending on a "fat" service they don't fully use.
 *
 * <p><b>D Principle</b>: Controllers and other services that need user data
 * depend on this interface, not on UserServiceImpl.
 */
public interface UserService {

    /**
     * Finds a user by their username.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if not found
     */
    User findByUsername(String username);

    /**
     * Finds a user by their ID.
     *
     * @throws com.taskmanager.exception.ResourceNotFoundException if not found
     */
    User findById(Long id);
}
