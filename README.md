# Seatix Event Ticketing Portal

This repository contains Seatix, a web portal for event ticketing and seat reservation with seat maps. It includes a backend API built with NestJS and a frontend application built with React and Vite.

Repository: https://github.com/ofojichigozie/seatix

## Structure
- `seatix-backend/` — backend API, database schema, migrations, authentication, and booking logic.
- `seatix-frontend/` — frontend web application for browsing events, reserving seats, and account management.

## Setup Guide

### Backend
1. Open a terminal and go to `seatix-backend/`.
2. Run `npm install` to install backend dependencies.
3. Create a `.env` file from `.env.example` and configure database credentials.
4. Run database commands as needed:
   - `npm run db:generate` to generate Drizzle schema files.
   - `npm run db:migrate` to run database migrations.
   - `npm run db:seed` to seed initial data.
5. Start the backend in development mode with `npm run start:dev`.

### Frontend
1. Open a terminal and go to `seatix-frontend/`.
2. Run `npm install` to install frontend dependencies.
3. Start the development server with `npm run dev`.
4. Build for production with `npm run build`.

## Notes
- Each child folder has its own `.gitignore` file for folder-specific ignores.
