# � PrimeTrade E-Commerce Platform

A modern, full-stack e-commerce application built with the **MERN Stack** (MongoDB, Express, React, Node.js). Features a responsive design, user authentication, functionality for a shopping cart, and a comprehensive admin dashboard.

![PrimeTrade Preview](https://via.placeholder.com/800x400.png?text=PrimeTrade+Dashboard+Preview)

---

## � Quick Start Guide

Follow these steps to get the project running locally in minutes.

### � Prerequisites

Ensure you have the following installed:
*   **Node.js** (v14 or higher)
*   **MongoDB** (Local instance or MongoDB Atlas Connection String)
*   **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd primetrade-v0
```

---

### 2️⃣ Backend Setup

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory and add the following:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/primetrade  # Or your MongoDB Atlas URI
    JWT_SECRET=your_super_secret_jwt_key_here
    JWT_EXPIRE=30d
    NODE_ENV=development
    ```

4.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    *The server should run on `http://localhost:5000`*

---

### 3️⃣ Frontend Setup

1.  **Open a new terminal and navigate to the frontend folder:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `frontend` directory (optional if defaults work, but recommended):

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Start the Frontend Application:**
    ```bash
    npm run dev
    ```
    *The application will open at `http://localhost:5173` (or the port shown in terminal)*

---

## � Default Credentials (for testing)

You can register a new user, or if you seeded the database:

**Admin Account:**
*   **Email:** `admin@example.com`
*   **Password:** `admin123`

**User Account:**
*   **Email:** `user@example.com`
*   **Password:** `user123`

---

## 🛠️ Tech Stack

### Frontend
*   **React** (Vite)
*   **Tailwind CSS** - Styling
*   **React Router DOM** - Navigation
*   **Axios** - API Requests
*   **React Hot Toast** - Notifications
*   **Context API** - State Management (Auth, Cart)

### Backend
*   **Node.js & Express** - Server
*   **MongoDB & Mongoose** - Database
*   **JSON Web Token (JWT)** - Authentication
*   **Bcryptjs** - Password Hashing

---

## ✨ Features

*   **Authentication**: Login, Register, JWT-based protected routes.
*   **Product Management**: Browse, Search, Filter by Category.
*   **Shopping Cart**: Add/Remove items, Update quantities, Real-time totals.
*   **Admin Dashboard**:
    *   Manage Products (Create, Read, Update, Delete).
    *   Manage Users (View list, Change roles, Deactivate users).
*   **Responsive UI**: Optimized for Mobile, Tablet, and Desktop.

---

## � Project Structure

```
primetrade-v0/
├── backend/            # Express Server
│   ├── config/         # DB Connection
│   ├── controllers/    # Route Logic
│   ├── models/         # Mongoose Schemas
│   └── routes/         # API Routes
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── context/    # Global State
    │   ├── pages/      # Page Views (Auth, Admin, Common)
    │   └── services/   # API Integration
```

---

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
