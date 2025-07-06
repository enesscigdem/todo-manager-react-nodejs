# Todo list React app

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/enesscigdems-projects/v0-todo-list-react-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Fbzcf3uscgX)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/enesscigdems-projects/v0-todo-list-react-app](https://vercel.com/enesscigdems-projects/v0-todo-list-react-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/Fbzcf3uscgX](https://v0.dev/chat/projects/Fbzcf3uscgX)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
## Backend API

This repository also includes an Express.js API powering the React frontend.

### Setup

1. Copy `.env.example` to `.env` and fill in `MSSQL_CONNECTION_STRING` and `JWT_SECRET`.
   The connection string looks like:
   ```
   MSSQL_CONNECTION_STRING="server=localhost;uid=sa;database=todo_manager;TrustServerCertificate=true;"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Endpoints

- `POST /api/auth/register` – Register with `{email, password}` and receive `{token}`.
- `POST /api/auth/login` – Login with credentials and receive `{token}`.
- `GET /api/tasks` – List your tasks. Query params: `filter=all|active|completed`, `search`.
- `POST /api/tasks` – Create a task with `{title, description?, priority?}`.
- `PUT /api/tasks/:id` – Update any task field.
- `PATCH /api/tasks/:id/toggle` – Toggle completion.
- `DELETE /api/tasks/:id` – Delete a task.

All `/api/tasks` routes require an `Authorization: Bearer <token>` header.

### Example Usage with curl

```bash
# register
curl -X POST http://localhost:3001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'

# login
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'

# list tasks
curl http://localhost:3001/api/tasks -H 'Authorization: Bearer <token>'
```
