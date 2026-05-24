# 📝 Task Manager Application

![Full Stack](https://img.shields.io/badge/Full%20Stack-React%20%7C%20Spring%20Boot-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-19-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, full-stack task management application designed to demonstrate clean architecture and **SOLID Principles**. The project features a robust Spring Boot backend with JWT authentication and a responsive React frontend powered by Vite and Tailwind CSS.

## ✨ Features

- **User Authentication:** Secure JWT-based login and registration system.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) capabilities for tasks.
- **Modern UI/UX:** Responsive, beautifully designed frontend using Tailwind CSS and Lucide React icons.
- **Form Validation:** Client-side validation using React Hook Form + Zod, and server-side Bean Validation.
- **State Management:** Efficient data fetching and caching with React Query.
- **Interactive API Docs:** Auto-generated Swagger UI for easy API testing and exploration.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Data Fetching:** Axios & React Query
- **Forms & Validation:** React Hook Form & Zod
- **Icons:** Lucide React

### Backend
- **Framework:** Spring Boot 3.2.5 (Java 17)
- **Security:** Spring Security & JJWT (JSON Web Tokens)
- **Data Access:** Spring Data JPA
- **Database:** PostgreSQL (Optimized for Neon Serverless)
- **API Documentation:** SpringDoc OpenAPI (Swagger)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven
- PostgreSQL

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend` directory and configure your database and JWT secret:
   ```env
   DB_URL=jdbc:postgresql://your-db-url
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_with_at_least_32_characters_for_hs256
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Or use `mvn spring-boot:run` if Maven is installed globally).*
   
   The backend server will start on `http://localhost:8080`. You can explore the API documentation at `http://localhost:8080/swagger-ui.html`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.

## 📐 Architecture & Design Principles

This project was built with a focus on maintainability and scalability, adhering to **SOLID Principles**:
- **Single Responsibility Principle:** Strict separation of concerns between Controllers, Services, and Repositories.
- **Open/Closed Principle:** Services are designed to be extensible without modifying existing business logic.
- **Liskov Substitution Principle:** Proper use of interfaces in the service layer.
- **Interface Segregation Principle:** Interfaces are kept specific to client needs.
- **Dependency Inversion Principle:** High-level modules depend on abstractions (interfaces) rather than concrete implementations via Spring's Dependency Injection.
