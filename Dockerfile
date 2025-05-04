FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/ .
RUN mvn clean package -DskipTests

# Copy frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final image
FROM openjdk:17-slim
WORKDIR /app

# Copy frontend build
COPY --from=builder /app/dist /app/frontend

# Copy backend JAR
COPY --from=builder /app/target/app.jar /app/app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
