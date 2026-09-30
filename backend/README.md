# Backend
Express.js + MongoDB/Mongoose Event Registration System.

Run: `npm install`, copy `.env.example` to `.env`, start MongoDB, then `npm run dev`.

Models: User, Event, Registration.
APIs: POST /api/auth/register, POST /api/auth/login, GET /api/events, GET /api/events/:id, POST /api/events, POST /api/registrations/:eventId, GET /api/registrations/my, DELETE /api/registrations/:eventId.

POST /api/events requires an organizer JWT.