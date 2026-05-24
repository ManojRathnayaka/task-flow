package com.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * LoginRequest DTO — carries only the data needed for authentication.
 *
 * <p><b>S Principle</b>: This class has one purpose — transporting login credentials
 * from the HTTP layer to the service layer. Validation annotations are the only
 * logic it contains.
 */
public class LoginRequest {

    private static final Logger log = LoggerFactory.getLogger(LoginRequest.class);

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }

    public static class LoginRequestBuilder {
        private String username;
        private String password;

        LoginRequestBuilder() {
        }

        public LoginRequestBuilder username(String username) {
            this.username = username;
            return this;
        }

        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            return new LoginRequest(username, password);
        }
    }
}
