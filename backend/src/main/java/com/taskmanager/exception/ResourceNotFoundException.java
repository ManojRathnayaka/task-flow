package com.taskmanager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * ResourceNotFoundException — thrown when a requested entity is not found.
 *
 * <p><b>S Principle</b>: A dedicated exception class for 404 scenarios.
 * {@code @ResponseStatus} maps this to HTTP 404, reducing boilerplate in controllers.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
