package com.taskmanager.model;

import jakarta.persistence.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * User — JPA entity representing an application user.
 *
 * <p><b>S Principle</b>: This class is solely responsible for representing user data.
 * It does NOT handle authentication logic, password encoding, or JWT — those are
 * delegated to dedicated classes (AuthServiceImpl, JwtTokenProvider, etc.).
 *
 * <p>Standard Java boilerplate is used instead of Lombok annotations.
 */
@Entity
@Table(name = "users")
public class User {

    private static final Logger log = LoggerFactory.getLogger(User.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique login identifier */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** Unique email address */
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    /** BCrypt-hashed password — never stored in plain text */
    @Column(nullable = false)
    private String password;

    /**
     * Bidirectional relationship: User owns Tasks.
     * CascadeType.ALL + orphanRemoval ensures tasks are deleted with the user.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Task> tasks = new ArrayList<>();

    public User() {
    }

    public User(Long id, String username, String email, String password, List<Task> tasks) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tasks = tasks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private List<Task> tasks = new ArrayList<>();

        UserBuilder() {
        }

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder tasks(List<Task> tasks) {
            this.tasks = tasks;
            return this;
        }

        public User build() {
            return new User(id, username, email, password, tasks);
        }
    }
}
