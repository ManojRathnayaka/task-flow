# =============================================================================
# Stage 1: Build Phase
# =============================================================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml file first to cache dependency downloads in docker layers
COPY pom.xml .

# Download dependencies in offline mode to speed up subsequent builds
RUN mvn dependency:go-offline -B

# Copy the application source code
COPY src ./src

# Build the package (skip tests during container build as they can be run in CI)
RUN mvn clean package -DskipTests

# =============================================================================
# Stage 2: Runtime Phase
# =============================================================================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose standard Spring Boot port
EXPOSE 8080

# Run the jar with active optimizations
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
