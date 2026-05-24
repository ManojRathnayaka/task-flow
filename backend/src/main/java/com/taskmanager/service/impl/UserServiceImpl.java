package com.taskmanager.service.impl;

import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserServiceImpl — concrete implementation of UserService.
 *
 * <p><b>S Principle</b>: Only responsible for user retrieval. It does not
 * handle authentication, task management, or any other concern.
 *
 * <p><b>L Principle</b>: Fully substitutable for UserService anywhere it is injected.
 *
 * <p><b>D Principle</b>: Depends on UserRepository abstraction (JpaRepository),
 * not a specific database driver or ORM-specific class.
 */
@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
