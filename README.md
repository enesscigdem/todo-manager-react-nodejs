# Todo Manager App

A full-stack to-do list application featuring a React frontend and a Node.js/Express backend with MSSQL persistence.

## Features

* ✅ **Task CRUD**: Create, read, update, and delete tasks
* 🎯 **Toggle Completion**: Mark tasks active or completed with a single click
* 🔍 **Filtering & Search**: View all, active, or completed tasks and filter by title
* 🔒 **Persistent Storage**: Tasks saved in SQL Server database
* ⚙️ **RESTful API**: Clean, documented endpoints
* 📦 **Production-Ready**: CORS, JSON parsing, and error handling

## Tech Stack

* **Frontend:** React (Create React App), Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, mssql driver
* **Database:** Microsoft SQL Server

## Project Structure

```
/
├─ backend/
│  ├─ db.js           # MSSQL connection pool
│  ├─ index.js        # Express server setup, CORS, JSON middleware
│  └─ routes/tasks.js # GET/POST/PUT/PATCH/DELETE /api/tasks routes
├─ frontend/
│  ├─ src/
│  │  ├─ App.js       # Main React component with routing
│  │  ├─ components/  # TaskList, TaskItem, TaskForm
│  │  └─ api.js       # Axios instance pointing to backend
│  └─ tailwind.config.js
├─ package.json       # Root scripts for dev & start
└─ README.md
```

## Getting Started Locally

1. **Clone & install**

   ```bash
   git clone https://github.com/enesscigdem/todo-manager-react-nodejs.git
   cd todo-manager-react-nodejs
   ```
2. **Backend setup**

   ```bash
   cd backend
   npm install
   # .env:
   # MSSQL_CONNECTION_STRING="Server=<HOST>,1433;Database=<DB>;User Id=<USER>;Password=<PASS>;TrustServerCertificate=true;"
   npm start
   ```
3. **Frontend setup**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. **Browse** [http://localhost:3000](http://localhost:3000)

## API Endpoints

* **GET** `/api/tasks?filter=all|active|completed&search=<text>`
  List tasks, optional filter & search
* **POST** `/api/tasks`
  Create a new task with `{ title, description?, priority?, completed? }`
* **PUT** `/api/tasks/:id`
  Update any field of a task
* **PATCH** `/api/tasks/:id/toggle`
  Toggle task completion status
* **DELETE** `/api/tasks/:id`
  Remove a task

## Deployment

* Deploy frontend and backend separately (e.g., Vercel for frontend, Azure App Service for backend), or combine with a proxy.
* Ensure `MSSQL_CONNECTION_STRING` is set in production environment variables.
