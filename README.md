# Mosque Management System (MMS) [DEV PHASE]

A modern Node.js application for managing mosque operations including user management, donations, and financial tracking.

## Features

- **User Management**: Register and authenticate users with different roles (Superuser, Executive, Finance Executive, Donor, Member)
- **Donation Tracking**: Record and manage donations with multiple payment methods
- **Role-based Access**: Different permissions based on user roles
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, Morgan

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=mms_backend
   JWT_SECRET=your_jwt_secret
   ```

4. Set up database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## Roles

- **SUPERUSER**: Full system access
- **EXECUTIVE**: General management
- **FINANCE_EXECUTIVE**: Financial operations
- **DONOR**: Can make donations

## Database Schema

The system includes:
- **User Model**: User information with roles
- **Payment Model**: Donation/transaction tracking

## Development

- **TypeScript**: Full TypeScript support
- **Hot Reload**: Development server with auto-restart
- **Linting**: ESLint and Prettier configured
