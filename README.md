# Gestion Commande - Frontend

A modern web application for managing orders, products, suppliers, deliveries, and payments built with Angular.

![Angular](https://img.shields.io/badge/Angular-15-red)
![TypeScript](https://img.shields.io/badge/TypeScript-4.8-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Backend Repository](#backend-repository)
- [Author](#author)

## About the Project

Gestion Commande is a comprehensive logistics management system designed to streamline business operations. The frontend application provides an intuitive interface for managing the entire supply chain, from product inventory to order fulfillment and payment processing.

This application is built with Angular 15 and integrates with a Spring Boot backend API to deliver a complete enterprise solution.

## Features

### Core Functionality

- **User Authentication**: Secure login system with JWT token-based authentication
- **Dashboard**: Real-time statistics and key performance indicators
- **User Management**: Create, update, and manage user accounts with role-based access control
- **Product Management**: Complete product catalog with stock tracking and low-stock alerts
- **Order Management**: Create and track orders with detailed order line items
- **Delivery Management**: Monitor and manage delivery status and logistics
- **Payment Management**: Track payments with multiple payment methods
- **Supplier Management**: Maintain supplier database and relationships
- **Transporter Management**: Manage delivery carriers and transportation

### Additional Features

- Responsive design for desktop and mobile devices
- Role-based access control (Admin and User roles)
- Real-time data updates
- Advanced search and filtering
- Data validation and error handling
- Secure HTTP interceptors for API communication

## Technologies Used

- **Framework**: Angular 15
- **Language**: TypeScript 4.8
- **Styling**: Bootstrap 5
- **HTTP Client**: Angular HttpClient
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: RxJS
- **Forms**: Reactive Forms
- **Routing**: Angular Router with Guards

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- Angular CLI (version 15.x)

```bash
npm install -g @angular/cli@15
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/touzgar/jee_project_front.git
cd jee_project_front
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API endpoint:

The backend API URL is configured in the service files. By default, it points to:
```
http://localhost:8080
```

If your backend runs on a different port, update the `apiUrl` in each service file located in `src/app/services/`.

## Running the Application

### Development Server

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

### Build for Production

Build the project for production:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute unit tests:

```bash
ng test
```

Execute end-to-end tests:

```bash
ng e2e
```

## Project Structure

```
src/app/
├── Component/              # UI Components
│   ├── commande/          # Order management components
│   ├── dashboard/         # Dashboard and analytics
│   ├── fournisseur/       # Supplier management
│   ├── landing/           # Landing page
│   ├── lignecommande/     # Order line items
│   ├── livraison/         # Delivery management
│   ├── login/             # Authentication
│   ├── paiement/          # Payment management
│   ├── produit/           # Product management
│   ├── transporteur/      # Transporter management
│   └── user/              # User management
├── model/                 # TypeScript data models
│   ├── commande.model.ts
│   ├── fournisseur.model.ts
│   ├── ligneCommande.model.ts
│   ├── livraison.model.ts
│   ├── paiement.model.ts
│   ├── produit.model.ts
│   ├── transporteur.model.ts
│   └── user.model.ts
├── services/              # API services
│   ├── auth.service.ts
│   ├── commande.service.ts
│   ├── fournisseur.service.ts
│   ├── lignecommande.service.ts
│   ├── livraison.service.ts
│   ├── paiement.service.ts
│   ├── produit.service.ts
│   ├── transporteur.service.ts
│   └── user.service.ts
├── admin.guard.ts         # Admin route protection
├── auth.guard.ts          # Authentication guard
├── auth.interceptor.ts    # HTTP interceptor for JWT
├── app-routing.module.ts  # Application routes
├── app.component.ts       # Root component
└── app.module.ts          # Root module
```

## API Integration

The application communicates with a RESTful API backend. All HTTP requests are automatically intercepted to include JWT authentication tokens.

### Base API URL

```
http://localhost:8080
```

### API Endpoints

- `/login` - User authentication
- `/api/user/*` - User management
- `/api/produit/*` - Product operations
- `/api/commande/*` - Order management
- `/api/lignecommande/*` - Order line items
- `/api/livraison/*` - Delivery tracking
- `/api/paiement/*` - Payment processing
- `/api/fournisseur/*` - Supplier management
- `/api/transporteur/*` - Transporter management

## Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:

1. User logs in with credentials
2. Backend returns JWT token in Authorization header
3. Token is stored in localStorage
4. HTTP interceptor automatically adds token to all API requests
5. Route guards protect authenticated routes

### Default Credentials

For testing purposes:
- **Admin**: username: `admin`, password: `123`
- **User**: username: `user1`, password: `123`

### Guards

- **AuthGuard**: Protects routes requiring authentication
- **AdminGuard**: Restricts access to admin-only routes

## Backend Repository

The backend API for this application is built with Spring Boot and can be found at:

**Backend Repository**: [https://github.com/touzgar/jee_project_back](https://github.com/touzgar/jee_project_back)

Make sure the backend server is running before starting the frontend application.


## Development Guidelines

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Implement reactive programming with RxJS
- Write modular and reusable components

### Component Structure

Each feature module follows this structure:
- List component (display data)
- Form component (create/edit)
- Detail component (view details)

### Service Layer

Services handle all API communication and business logic, keeping components focused on presentation.






## Acknowledgments

This project was developed as part of a JEE (Java Enterprise Edition) academic curriculum, demonstrating modern web application development practices with Angular and Spring Boot.
