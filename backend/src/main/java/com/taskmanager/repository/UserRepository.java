package com.taskmanager.repository;

import com.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository — data access for User entities.
 *
 * <p><b>D Principle</b>: Higher-level services depend on this abstraction (JpaRepository),
 * not on a specific database implementation. Swapping H2 for PostgreSQL requires
 * zero code changes in service or controller layers.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
