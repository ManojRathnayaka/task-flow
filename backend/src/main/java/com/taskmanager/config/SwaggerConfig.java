package com.taskmanager.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SwaggerConfig — configures SpringDoc OpenAPI / Swagger UI.
 *
 * <p><b>S Principle</b>: Single responsibility — API documentation configuration only.
 *
 * <p>Adds a "bearerAuth" security scheme so Swagger UI can send JWT tokens
 * in the Authorization header when testing secured endpoints.
 *
 * <p>Access the UI at: <a href="http://localhost:8080/swagger-ui.html">
 * http://localhost:8080/swagger-ui.html</a>
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Task Manager API")
                        .description("""
                                RESTful API for the Task Management application.
                                
                                **SOLID Principles Demo:**
                                - S: Each class has one responsibility
                                - O: Open for extension, closed for modification
                                - L: Implementations are substitutable for interfaces
                                - I: Focused, segregated interfaces
                                - D: Depend on abstractions, not concretions
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Task Manager Team")
                                .email("dev@taskmanager.com")))
                // Require the bearerAuth scheme for all endpoints by default
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste your JWT token here (without 'Bearer ' prefix)")));
    }
}
