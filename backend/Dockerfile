# Build stage using Maven and Eclipse Temurin (JDK 17)
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the project without running tests
RUN mvn clean package -DskipTests

# Runtime stage using OpenJDK 17 (slim image)
FROM openjdk:17-slim

WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the backend port
EXPOSE 8081

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
