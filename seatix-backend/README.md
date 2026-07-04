# Seatix Backend

This folder contains the backend API for Seatix, built with NestJS and Drizzle ORM. It manages users, events, seat maps, bookings, and payments.

## Setup
1. Open a terminal in `seatix-backend/`.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and add your database configuration.
4. Run `npm run db:generate` if you need to regenerate database schema files.
5. Run `npm run db:migrate` to apply migrations.
6. Run `npm run db:seed` to add initial seed data.
7. Use `npm run start:dev` to start the backend server in development mode.

## Useful Scripts
- `npm run build` — build the backend.
- `npm run start` — start the built backend.
- `npm run start:dev` — run the backend in watch mode.
- `npm run lint` — lint backend source files.
- `npm run format` — format backend TypeScript files.
