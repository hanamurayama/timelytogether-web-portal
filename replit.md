# TimelyTogether E-Portal

## Overview

TimelyTogether E-Portal is a family reminder management system designed to help families create and manage reminders for seniors. The application prioritizes accessibility with a clean, senior-friendly interface that supports both light and dark modes. Users can create reminders with customizable scheduling options (one-time, daily, weekly, monthly), set completion alerts, and configure email notifications for family members.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (instead of React Router)
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports

**UI Component System**
- Shadcn UI component library with "new-york" style variant
- Radix UI primitives for accessible, unstyled component foundations
- Tailwind CSS for utility-first styling with custom design tokens
- Design system emphasizes high contrast, large touch targets (44px minimum), and clear visual hierarchy for senior accessibility
- Custom color palette optimized for readability with deep blue primary (210 100% 25%) and enhanced contrast ratios

**State Management**
- TanStack Query (React Query) for server state management and API caching
- Local React state for UI-specific concerns
- Form state managed through React Hook Form with Zod validation

**Accessibility Design Principles**
- 16px base font size (larger than typical web apps)
- Rubik font family for enhanced readability
- Consistent spacing units (4, 6, 8, 12) from Tailwind
- Character limits enforced: 40 for titles, 120 for messages
- Theme persistence via localStorage with system preference detection

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- Custom middleware for request/response logging with 80-character truncation
- JSON body parsing for API requests
- Error handling middleware with standardized error responses

**Application Structure**
- Multi-step reminder creation flow: Create → Review → Completion
- In-memory storage implementation (MemStorage) as default data layer
- UUID-based resource identification using Node's crypto module
- RESTful API design pattern for reminder CRUD operations

**API Endpoints**
- `POST /api/reminders` - Create new reminder with validation
- `GET /api/reminders` - Retrieve all reminders
- `GET /api/reminders/:id` - Retrieve specific reminder by ID

### Data Storage Solutions

**Schema Definition**
- Drizzle ORM with PostgreSQL dialect for database abstraction
- Schema-first approach with TypeScript type inference
- Zod schemas derived from Drizzle tables for runtime validation

**Database Tables**
- `users`: User authentication (id, username, password)
- `reminders`: Reminder data with fields for title, message, scheduling (date, time, recurrence), completion alerts, and custom notification emails
- UUID primary keys with `gen_random_uuid()` default
- Timestamp tracking with automatic `now()` defaults

**Storage Interface Pattern**
- `IStorage` interface defines contract for data operations
- `MemStorage` provides in-memory implementation for development/testing
- Abstraction allows easy swap to database-backed storage (e.g., PostgreSQL via Neon)

### Authentication and Authorization

**Current State**
- User table schema exists but authentication not yet implemented
- Password field present in users table (hashing strategy to be determined)
- Session management infrastructure not yet configured (connect-pg-simple package available)

### Design System Integration

**Theme Configuration**
- CSS custom properties for dynamic theming
- Light/dark mode toggle with system preference detection
- Color tokens follow HSL format for easier manipulation
- Accessible color contrast ratios meeting WCAG standards
- Custom shadow and border utilities for visual depth

**Component Patterns**
- Card-based layouts for content organization
- Form components with prominent labels above inputs
- Badge components for status indication
- Icon integration via Lucide React

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL provider (via `@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe database toolkit for schema definition and queries
- **Drizzle Kit**: Migration management and schema pushing
- Connection configured via `DATABASE_URL` environment variable

### UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible React components (22+ component primitives)
- **Shadcn UI**: Pre-styled component collection built on Radix UI
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Carousel/slider functionality
- **CMDK**: Command menu/palette component

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with Autoprefixer
- **class-variance-authority**: Type-safe variant styling
- **clsx & tailwind-merge**: Conditional class name utilities

### Form Handling & Validation
- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Data Fetching
- **TanStack Query v5**: Server state management with caching, background updates, and optimistic updates
- Custom `apiRequest` wrapper for fetch API with error handling
- Query client configured with infinite stale time and disabled auto-refetching

### Development Tools
- **Vite**: Build tool with React plugin and custom Replit integrations
- **TypeScript**: Type safety across client and server
- **tsx**: TypeScript execution for development server
- **esbuild**: Production server bundling

### Session Management (Available but Not Implemented)
- **connect-pg-simple**: PostgreSQL session store for Express (package installed)
- **express-session**: Session middleware (implied by connect-pg-simple dependency)

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for client-side needs

### Google Fonts
- **Rubik font family**: Loaded via Google Fonts CDN for enhanced readability