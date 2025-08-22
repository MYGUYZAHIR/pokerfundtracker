# Game Profile Manager

## Overview

A full-stack web application for managing player profiles in a gaming system. The application allows users to view player statistics, update funds, and track profile information with real-time updates. Built with a React frontend using shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Components**: Implements shadcn/ui component library with Radix UI primitives for accessible, customizable components. Uses Tailwind CSS for styling with CSS variables for theming support.

**State Management**: TanStack React Query for server state management, providing caching, background updates, and optimistic updates for API interactions.

**Routing**: Wouter for lightweight client-side routing with a simple component-based route configuration.

**Form Handling**: React Hook Form with Zod validation for type-safe form validation and submission.

### Backend Architecture

**Framework**: Express.js with TypeScript for the REST API server.

**API Design**: RESTful endpoints for profile management with proper HTTP status codes and error handling. Implements request logging middleware for debugging and monitoring.

**Data Layer**: Abstracted storage interface (`IStorage`) allowing for different storage implementations. Currently uses in-memory storage (`MemStorage`) for development with pre-populated player data.

**Validation**: Zod schemas for request validation, ensuring type safety across the frontend and backend boundary.

### Database Architecture

**ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in TypeScript.

**Schema**: Profile table with fields for id, name, level, funds, avatarUrl, and lastUpdated timestamp. Uses UUID primary keys with PostgreSQL-specific features.

**Migrations**: Drizzle Kit for database schema migrations with configuration pointing to shared schema definitions.

### Development Environment

**Monorepo Structure**: Client and server code in separate directories with shared schema definitions for type consistency.

**Build Process**: Vite for frontend bundling, esbuild for backend bundling. Development mode runs both frontend and backend concurrently.

**Hot Reload**: Vite HMR for frontend development with middleware integration for seamless development experience.

## External Dependencies

**Database**: PostgreSQL via Neon Database serverless driver for cloud-hosted database connections.

**UI Framework**: Radix UI primitives for accessible component foundations, shadcn/ui for pre-built component implementations.

**Styling**: Tailwind CSS for utility-first styling with PostCSS for processing.

**Validation**: Zod for runtime type validation and schema definition across frontend and backend.

**HTTP Client**: Native fetch API with custom wrapper functions for API requests with built-in error handling.

**Development Tools**: Replit-specific plugins for development environment integration and error overlay functionality.

**Icons**: Lucide React for consistent iconography throughout the application.

**Date Handling**: date-fns for date formatting and manipulation utilities.