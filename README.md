<p align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🎓 SkillNest.lk</h1>
<h3 align="center">Academic & Online Resources Management System</h3>
<p align="center"><em>A comprehensive MERN stack application for university student support — peer help, tutor matching, and study resource sharing.</em></p>

<p align="center">
  <strong>Module:</strong> IT2080 — Information Technology Project Management (ITPM)<br/>
  <strong>Group:</strong> WE_314_2.2 &nbsp;|&nbsp; <strong>Institution:</strong> Sri Lanka Institute of Information Technology (SLIIT)
</p>

---

## 📖 About The Project

**SkillNest.lk** is an all-in-one academic support platform designed to enhance the learning experience for university students. The system connects students with tutors, enables peer-to-peer collaboration, and provides a centralized hub for sharing and discovering study resources.

### ✨ Key Highlights

- 🔐 **Role-Based Access Control** — Student, Tutor, and Admin roles with JWT authentication
- 🎫 **Smart Ticketing System** — 4-step ticket creation wizard with auto-tutor matching
- 💬 **Real-Time Chat** — Socket.IO-powered messaging for ticket-based conversations
- 📚 **Resource Sharing Hub** — Upload, rate, bookmark, and discover study materials
- 🤖 **AI Notes Summarizer** — Intelligent summary generation from uploaded resources
- 📊 **Academic Profiling** — Track GPA, skills, strengths, and weaknesses with visual analytics

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 18)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Auth &   │  │ Ticketing│  │ Resource │  │   Dashboard  │   │
│  │ Profiles  │  │  System  │  │  Sharing │  │   & Admin    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       └──────────────┴─────────────┴───────────────┘           │
│                         Axios + Socket.IO                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST API + WebSocket
┌───────────────────────────┴─────────────────────────────────────┐
│                    SERVER (Express + Node.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Routes   │  │Middleware│  │  Models  │  │   Services   │   │
│  │ (REST)    │  │  (JWT)   │  │(Mongoose)│  │  (Business)  │   │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └──────────────┘   │
│       └───────────────────────────┘                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │     MongoDB (Atlas)        │
              │   Database: skillnest      │
              └───────────────────────────┘
```

---

## 📦 Module Overview

| Module | Feature | Owner |
|--------|---------|-------|
| **Module 1** | User Management & Academic Profiling | S.S Pathiranage |
| **Module 2** | Peer Help, Tutor Support & Ticketing System | Lakshan W.A.K.T.K |
| **Module 3** | Study Resources & Notes Sharing | Yasintha W.K.M |

### 🔹 Module 1 — User Management & Academic Profiling
- Role-based login (Student / Tutor / Admin) with modal popup
- JWT authentication with bcrypt password hashing
- Multi-step academic profile form (4 steps)
- Degree program, semester, subjects, GPA tracking
- Skills assessment with star ratings & strength/weakness tagging
- Profile completion progress bar + circular chart
- Change password, recent activity, account settings
- Admin: full user management CRUD table

### 🔹 Module 2 — Peer Help, Tutor Support, Quiz & Assignment Help
- Ticketing system with 4-step ticket creation wizard
- Help types: Peer Help, Tutor Support, Quiz Help, Assignment Help
- Auto-match with available tutors by module
- Ticket lifecycle: Open → In Progress → Resolved → Closed
- Real-time chat per ticket using Socket.IO
- Ticket status filtering and priority levels (Low / Medium / High)
- Student & tutor dashboard views

### 🔹 Module 3 — Study Resources & Notes Sharing
- Upload PDFs and external links
- Subject + semester categorization with tags
- Search & filter by subject, semester, type, keyword
- Bookmark system (per user)
- 5-star rating system
- Admin approval workflow (Pending → Approved / Rejected)
- 🤖 AI Notes Summarizer — generates summary + key points from any resource
- Download counter tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO, Multer, JWT |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt |
| **Real-Time** | Socket.IO (WebSocket) |
| **AI Feature** | PDF-Parse + AI Summarization |

---

## ✅ Prerequisites

Ensure the following tools are installed before setup:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) |
| **MongoDB** | v6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **npm** | v9+ *(bundled with Node.js)* | — |

```bash
# Verify installations
node -v && npm -v && mongod --version
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/TKwanniarachchi/SkillNest-ITPM-.git
cd SkillNest-ITPM-
```

### 2️⃣ Start MongoDB

**Windows:**
```bash
mongod --dbpath C:\data\db
# Or open MongoDB Compass
```

**macOS / Linux:**
```bash
mongod
# Or: brew services start mongodb-community
```

### 3️⃣ Setup & Run Backend

```bash
cd backend
npm install

# Configure environment variables
# The .env file should contain:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/skillnest
# JWT_SECRET=your_secret_key

# Seed demo data (optional but recommended)
node seed.js

# Start the server
npm run dev
```

> ✅ Backend available at: **http://localhost:5000**

### 4️⃣ Setup & Run Frontend

Open a **new terminal window**:

```bash
cd frontend
npm install
npm start
```

> ✅ Frontend available at: **http://localhost:3000**

### 🖥️ Quick Reference

| Terminal | Command | URL |
|----------|---------|-----|
| Backend | `cd backend && npm run dev` | http://localhost:5000 |
| Frontend | `cd frontend && npm start` | http://localhost:3000 |

---

## 👥 Demo Accounts

After running `node seed.js`, use these credentials to test the system:

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | `admin@skillnest.lk` | `password123` |
| 👨‍🏫 Tutor | `kamal@skillnest.lk` | `password123` |
| 👨‍🏫 Tutor | `nimali@skillnest.lk` | `password123` |
| 🎓 Student | `david@skillnest.lk` | `password123` |
| 🎓 Student | `amara@skillnest.lk` | `password123` |

---

## 🔌 API Reference

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |
| `GET` | `/api/auth/me` | Get authenticated user profile |
| `PUT` | `/api/auth/change-password` | Update password |

</details>

<details>
<summary><strong>👤 Users</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users *(Admin only)* |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user profile |
| `DELETE` | `/api/users/:id` | Delete user *(Admin only)* |

</details>

<details>
<summary><strong>🎫 Tickets</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | Get user's tickets |
| `POST` | `/api/tickets` | Create a new ticket |
| `GET` | `/api/tickets/:id` | Get ticket details |
| `PUT` | `/api/tickets/:id` | Update ticket status |
| `DELETE` | `/api/tickets/:id` | Delete a ticket |

</details>

<details>
<summary><strong>💬 Messages</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages/:ticketId` | Get chat messages for a ticket |
| `POST` | `/api/messages` | Send a new message |
| `DELETE` | `/api/messages/:id` | Delete a message |

</details>

<details>
<summary><strong>📚 Resources</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/resources` | List resources with filters |
| `POST` | `/api/resources` | Upload a new resource |
| `GET` | `/api/resources/:id` | Get resource details |
| `PUT` | `/api/resources/:id` | Update a resource |
| `DELETE` | `/api/resources/:id` | Delete a resource |
| `POST` | `/api/resources/:id/bookmark` | Toggle bookmark |
| `POST` | `/api/resources/:id/rate` | Rate a resource (1–5 stars) |
| `POST` | `/api/resources/:id/approve` | Admin approve / reject |
| `POST` | `/api/resources/:id/ai-summary` | Generate AI summary |

</details>

<details>
<summary><strong>👨‍🏫 Tutors</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tutors?module=xxx` | Get available tutors by module |

</details>

---

## 📁 Project Structure

```
SkillNest-ITPM/
│
├── backend/                      # Express.js REST API
│   ├── middleware/                # JWT authentication middleware
│   ├── models/                   # Mongoose schemas (User, Ticket, Message, Resource)
│   ├── routes/                   # API route handlers
│   ├── uploads/                  # File uploads directory (auto-generated)
│   ├── server.js                 # Application entry point
│   ├── seed.js                   # Database seeder script
│   └── package.json
│
├── frontend/                     # React 18 SPA
│   ├── public/                   # Static assets
│   └── src/
│       ├── components/           # Reusable UI components
│       ├── context/              # React Context (Auth state)
│       ├── pages/                # Page-level components
│       ├── App.js                # Application routing
│       └── index.css             # Global styles (gradient theme)
│
├── .gitignore
└── README.md
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB not connecting** | Ensure the MongoDB service is running. Verify `MONGO_URI` in `.env`. |
| **Port already in use** | Change `PORT` in `.env` and update `proxy` in `frontend/package.json`. |
| **`npm install` fails** | Delete `node_modules/` and `package-lock.json`, then retry. Ensure Node.js v18+. |
| **CORS errors** | Confirm backend is on port 5000. Check `proxy` in `frontend/package.json`. |

---

## 👨‍💻 Contributors

<table>
  <tr>
    <td align="center">
      <strong>S.S Pathiranage</strong><br/>
      <sub>IT23617100</sub><br/>
      <sub>📧 it23617100@my.sliit.lk</sub><br/><br/>
      <em>Module 1: User Management & Academic Profiling</em><br/>
      <sub>Role-based authentication, JWT security, multi-step profile wizard, admin user management</sub>
    </td>
    <td align="center">
      <strong>Lakshan W.A.K.T.K</strong><br/>
      <sub>IT23698918</sub><br/>
      <sub>📧 it23698918@my.sliit.lk</sub><br/><br/>
      <em>Module 2: Peer Help & Ticketing System</em><br/>
      <sub>Ticket creation wizard, auto-tutor matching, real-time chat, status management</sub>
    </td>
    <td align="center">
      <strong>Yasintha W.K.M</strong><br/>
      <sub>IT23715110</sub><br/>
      <sub>📧 it23715110@my.sliit.lk</sub><br/><br/>
      <em>Module 3: Study Resources & Notes Sharing</em><br/>
      <sub>Resource upload & management, bookmarks, ratings, AI summarizer, admin approval</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is developed as part of the **IT2080 — Information Technology Project Management** module at **SLIIT** and is intended for academic purposes.

---

<p align="center">
  Made with ❤️ by <strong>Team WE_314_2.2</strong> — SLIIT © 2025
</p>
