# Ticket Management System

This is a robust backend application for a Ticket Management System, built with Node.js, Express, and TypeScript. It features a comprehensive API for managing assignments, user authentication, and report generation, designed with a clean layered architecture.

## 📂 Folder Structure

The project is organized into a clear folder structure under `src/`:

- **`config/`**: Configuration files for Database, Email, Passport authentication, Rate limiting, and Swagger documentation.
- **`controller/`**: Controllers that handle incoming HTTP requests and send responses. They act as the entry point for the API logic.
- **`jobs/`**: Background jobs scheduled using `node-cron` for tasks like ticket assignment and auto-closing tickets.
- **`middlewares/`**: Custom Express middlewares for Authentication, Error handling, and Request validation.
- **`models/`**: Mongoose schemas and models defining the data structure for Users, Tickets, Comments, etc.
- **`routes/`**: Definition of API routes and their corresponding controller methods.
- **`services/`**: The core business logic layer. Services interact with models and perform complex operations.
- **`utils/`**: Utility classes and functions, such as custom Error classes and JWT helpers.
- **`validators/`**: Input validation schemas using `express-validator` to ensure data integrity.

## 🔑 Key Modules

1.  **Authentication & Authorization**: Secure user authentication using JSON Web Tokens (JWT) and Passport.js. Supports user registration, login, and protected routes.
2.  **Ticket Management**: Full CRUD operations for ticketing, allowing users to create, update, and track issues.
3.  **Comments System**: Allows users to add context and updates to tickets via comments.
4.  **Reporting**: Generates reports for system insights.
5.  **Background Jobs**:
    -   `ticketAssignment.job.ts`: Automatically assigns authentication tickets.
    -   `ticketClosing.job.ts`: Automatically closes resolved or stale tickets.
6.  **API Documentation**: Integrated Swagger UI for interactive API exploration.

## 🛡️ Middleware

-   **Auth Middleware**: Verifies JWT tokens to protect private routes and ensures users are authenticated.
-   **Validation Middleware**: Uses `express-validator` rules to validate request bodies and parameters before processing.
-   **Error Middleware**: A global error handling mechanism to catch exceptions and return standardized JSON error responses.
-   **Rate Limiting**: Protects the API from abuse by limiting the number of requests from a single IP.

## 🏗️ Architecture

The application follows a **Layered Architecture** (Controller-Service-Model pattern):

1.  **Route Layer**: Defines the endpoints and forwards requests to the appropriate controller.
2.  **Controller Layer**: Handles the HTTP request, invokes the necessary service functionality, and formats the HTTP response.
3.  **Service Layer**: Contains the business logic. It performs calculations, validations (business rules), and interacts with the data layer.
4.  **Data Access Layer (Models)**: Uses Mongoose to interact with the MongoDB database.

This separation of concerns ensures functionality is modular, testable, and maintainable.

## 🚀 Steps to Run Locally

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Running locally or a cloud instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ticket-management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the necessary environment variables:
    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/ticket-db
    JWT_SECRET=your_super_secret_key
    # Add other keys (email config, etc.) as required
    ```

4.  **Run the application:**

    -   **Development Mode** (with hot-reload):
        ```bash
        npm run dev
        ```
    -   **Production Build**:
        ```bash
        npm run build
        npm start
        ```

5.  **Access the API:**
    -   API Server: `http://localhost:3000/api`
    -   Swagger Documentation: `http://localhost:3000/api/docs`
