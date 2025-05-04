FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy and build backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/ .
RUN mvn clean package -DskipTests

# Use Node.js for frontend build
FROM node:16-alpine AS frontend-builder
WORKDIR /app

# Copy and build frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final image
FROM openjdk:17-slim
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/build /app/frontend

# Copy backend JAR
COPY --from=builder /app/target/leave-management-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
