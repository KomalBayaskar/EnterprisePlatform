# Enterprise AI Dashboard

This repository contains the source code for the Enterprise AI Dashboard. It features a modern, responsive single-page application built with React and Vite, paired with a Node.js Express backend.

## Overall System Design
The application is built on a full-stack JavaScript architecture:
- **Frontend**: A React 18 SPA bootstrapped with Vite. It uses Tailwind CSS for utility-first styling, Lucide-React for modern iconography, and Recharts for dynamic data visualization. State management and routing are handled by React Hooks and React Router.
- **Backend**: An Express.js REST API providing secure routes for user management, analytics tracking, and AI integration. 
- **Security**: The backend API endpoints are secured with a token-based authentication middleware. 

## API Structure
The backend provides a set of RESTful endpoints grouped under the `/api` route:

### Authentication
- `POST /api/auth/login` - Authenticates user credentials and provisions access.

### Users
- `GET /api/users` - Retrieves a list of all users.
- `POST /api/users` - Creates a new user record.
- `PUT /api/users/:id` - Updates an existing user's details.
- `DELETE /api/users/:id` - Deletes a user by ID.

### Analytics
- `GET /api/analytics/overview` - Retrieves high-level system metrics (total users, active sessions, API requests, system uptime, etc.).
- `GET /api/analytics/usage` - Retrieves trend data for rendering frontend usage charts.

### AI Integration
- `POST /api/ai/chat` - Submits a prompt to the AI assistant.
- `GET /api/ai/history` - Retrieves the history of prompts submitted to the AI.
- `GET /api/ai/usage` - Retrieves token and model usage metrics.

### System
- `GET /health` - Basic health-check endpoint.

## Data Modeling Approach
The system currently models data using core entities relevant to an enterprise AI platform:
- **User**: Represents a platform user (`id`, `name`, `email`, `role`, `status`, `department`, `lastActive`).
- **AI Usage**: Tracks individual interactions with the AI (`id`, `userId`, `prompt`, `model`, `tokens`, `cost`, `timestamp`).
- **Analytics**: Aggregated metrics combining system health and usage statistics.

## Assumptions Made
- The application relies on an enterprise context where users are assigned varying permissions (e.g., Super Admin, Editor, Viewer).
- AI models (e.g., GPT-3.5, GPT-4, Gemini) are billed based on tokens and require usage tracking per user.
- The platform assumes token-based authentication (`authenticateToken` middleware) for protecting sensitive routes.

## How Dummy Data is Used
During the current development phase, data is served from an in-memory flat object (`server/data/mockDb.js`). 
- **Seeding**: The backend initializes with predefined records for users, analytics, and AI history to populate the frontend components immediately.
- **Mutations**: Write operations (`POST`, `PUT`, `DELETE`) successfully mutate this JavaScript object in memory, allowing for full end-to-end testing of the frontend without needing a dedicated relational database running locally. Note that changes reset upon a server restart.

## Future Improvements
- **Database Integration**: Replace `mockDb.js` with a robust relational database (like PostgreSQL) or a NoSQL database (like MongoDB) for data persistence.
- **Authentication System**: Implement OAuth2 / SSO or robust JWT issuance with refresh tokens.
- **Production Readiness**: Implement strict rate limiting, input validation (e.g., via Zod or Joi), and centralized logging.
- **Containerization**: Add Dockerfiles and `docker-compose.yml` for simplified, reproducible deployments.
- **Caching**: Implement a Redis layer for analytics caching to reduce database load on heavy dashboards.
