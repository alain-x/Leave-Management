# Leave Management System - Backend

This is the backend component of the Leave Management System, built with Spring Boot and Java.

## Project Structure

- `src/main/java/` - Contains the main application code
- `src/main/resources/` - Contains configuration files and static resources
- `src/test/java/` - Contains test classes

## Prerequisites

- Java 17 or higher
- Maven 3.8.1 or higher
- Docker (for containerized deployment)

## Getting Started

### Running Locally

1. Clone the repository
2. Navigate to the backend directory
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t leave-management-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 leave-management-backend
   ```

## Configuration

The main configuration file is located at `src/main/resources/application.properties`. It contains settings for:
- Database connection
- Server port
- Application properties

## API Endpoints

The backend API runs on `http://localhost:8080`. Here are the main endpoints:

### Authentication

1. **Register User**
   - **POST** `/api/auth/register`
   - Example Request Body:
     ```json
     {
       "email": "alain@gmail.com",
       "password": "user123",
       "firstName": "Alain",
       "lastName": "Test",
       "role": "USER"
     }
     ```

2. **Login**
   - **POST** `/api/auth/login`
   - Example Request Body:
     ```json
     {
       "email": "alain@gmail.com",
       "password": "user123"
     }
     ```
   - Response will include a JWT token

3. **Verify Token**
   - **GET** `/api/auth/verify`
   - Include JWT token in Authorization header

### Leave Management

1. **Create Leave Request**
   - **POST** `/api/leave/requests`
   - Example Request Body:
     ```json
     {
       "startDate": "2025-05-05",
       "endDate": "2025-05-10",
       "leaveType": "VACATION",
       "reason": "Annual vacation"
     }
     ```

2. **Get Leave Requests**
   - **GET** `/api/leave/requests`
   - Returns all leave requests for the authenticated user

3. **Update Leave Request Status**
   - **PUT** `/api/leave/requests/{id}`
   - Example Request Body:
     ```json
     {
       "status": "APPROVED"
     }
     ```

4. **Get Leave Balance**
   - **GET** `/api/leave/balance`
   - Returns the user's remaining leave days

### Two-Factor Authentication

1. **Setup 2FA**
   - **POST** `/api/auth/2fa/setup`
   - Returns QR code for 2FA setup

2. **Verify 2FA Code**
   - **POST** `/api/auth/2fa/verify`
   - Example Request Body:
     ```json
     {
       "code": "123456"
     }
     ```

## Testing with Postman

1. Create a new POST request to `http://localhost:8080/api/auth/register` with the example user credentials
2. Use the same credentials to login at `http://localhost:8080/api/auth/login`
3. Copy the JWT token from the login response
4. For protected endpoints, add the token to the Authorization header as:
   ```
   Bearer <your-jwt-token>
   ```

## Building the Project

To build the project:
```bash
mvn clean install
```

This will create a JAR file in the `target` directory.

## Testing

To run the tests:
```bash
mvn test
```

## Project Dependencies

The project uses Spring Boot with the following main dependencies:
- Spring Web
- Spring Data JPA
- Spring Security
- Lombok
- H2 Database (for development)

## API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.