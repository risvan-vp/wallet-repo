# Wallet — Personal Finance Tracker

A full-stack project for recording income and expenses, organising categories, and reviewing spending over a selected date range.

## Features
- Registration and login with password hashing and JWT authentication.
- Add, edit, and delete transactions.
- Manage personal income and expense categories.
- Browse transactions in a calendar and view report charts.
- Retrieve date-range summaries using MongoDB aggregation.

## Stack
React, Vite, React Router, Axios, Recharts, Express, Node.js, MongoDB, and Mongoose.

## Run locally
Start a local MongoDB instance or prepare a MongoDB connection string.

In `backend/`, create a local `.env` file:
```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/wallet
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```
Keep real credentials out of Git.

Start the API:
```bash
cd backend
npm install
npm start
```

In a second terminal, from the repository root:
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite. The frontend API client currently points to `http://localhost:5000/api`; update `frontend/src/services/api.js` if the API runs elsewhere.

## Project structure
- `backend/models/`: users, categories, and transactions.
- `backend/routes/`: authentication, transaction, category, and report endpoints.
- `backend/middleware/`: authentication middleware.
- `frontend/src/pages/`: dashboard, calendar, reports, categories, and auth screens.
- `frontend/src/components/`: transaction forms and reusable interface elements.

## Development notes
This is a portfolio project. Before a public deployment, review input validation, date/time-zone handling, CORS configuration, and token storage. The current client stores its token in localStorage.

Frontend commands: `npm run build`, `npm run preview`, and `npm run lint` from `frontend/`.
