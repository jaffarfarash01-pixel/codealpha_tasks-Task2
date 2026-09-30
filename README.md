# Task 2 - Event Registration System

Built to match the assignment: Express.js backend, MongoDB database, Mongoose models, event APIs, registration APIs, user-event relationships, view/cancel registrations, and optional organizer authentication/authorization.

## Models
User: name, email, password, role
Event: title, description, date, location, capacity
Registration: references User and Event

## Run
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Start MongoDB
5. `npm run dev`
6. Open `frontend/index.html` with Live Server.

To test organizer: register a user, change its MongoDB `role` to `organizer`, then login again.

## API
POST /api/auth/register
POST /api/auth/login
GET /api/events
GET /api/events/:id
POST /api/events (organizer only)
POST /api/registrations/:eventId
GET /api/registrations/my
DELETE /api/registrations/:eventId