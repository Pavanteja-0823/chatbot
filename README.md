# AI Chat App 🤖

A full-stack ChatGPT-like AI chat application built with React, Express, MongoDB, and the Groq API. Features user authentication, persistent chat history, and a dark-themed responsive UI.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MongoDB%20%7C%20Groq%20API-10a37f)

## Features

- **🔐 User Authentication** — Register and login with JWT-based auth
- **💬 ChatGPT-style Chat UI** — Real-time messaging with typing indicators
- **📚 Conversation History** — All chats saved to MongoDB, organized by date
- **🌙 Dark Theme** — Sleek, responsive dark UI inspired by ChatGPT
- **⚡ Groq AI Integration** — Powered by the Llama 3 8B model via Groq API
- **📱 Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | React 18, Vite, Tailwind CSS, React Router      |
| Backend     | Node.js, Express.js                             |
| Database    | MongoDB with Mongoose ODM                       |
| AI API      | Groq SDK (llama3-8b-8192 model)                 |
| Auth        | JSON Web Tokens (JWT) + bcrypt                  |

## Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Chat context providers
│   │   └── pages/          # Page components
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API route definitions
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Groq API Key** — get one at [console.groq.com](https://console.groq.com)

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Navigate to the server directory
cd server

# Edit the .env file with your credentials
```

Edit `server/.env` with your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start the Application

**Run the backend** (from `/server`):

```bash
npm run dev    # with auto-reload (nodemon)
# or
npm start      # production mode
```

**Run the frontend** (from `/client`):

```bash
npm run dev
```

The app will open at **http://localhost:3000**.

## API Endpoints

| Method | Endpoint              | Auth | Description                    |
| ------ | --------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register`  | No   | Register a new user            |
| POST   | `/api/auth/login`     | No   | Login and get JWT token        |
| POST   | `/api/chat/send`      | Yes  | Send a message to the AI       |
| GET    | `/api/chat/history`   | Yes  | Get all user conversations     |
| GET    | `/api/chat/:id`       | Yes  | Get a specific conversation    |
| DELETE | `/api/chat/:id`       | Yes  | Delete a conversation          |
| GET    | `/api/health`         | No   | Health check                   |

## Deployment

### Building the Frontend

```bash
cd client
npm run build
```

The built files will be in `client/dist/`. You can serve them with the Express backend or deploy to any static hosting (Vercel, Netlify, etc.).

## What I Learned

- Building a full-stack application from scratch with React and Express
- Integrating third-party AI APIs (Groq) with streaming context awareness
- Implementing JWT authentication with protected routes
- Managing complex state with React Context API
- Designing responsive dark-themed UIs with Tailwind CSS
- Structuring a production-ready Node.js + MongoDB backend

---

Built with ❤️ as a portfolio project.
