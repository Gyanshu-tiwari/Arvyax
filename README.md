# Arvyax Wellness Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing wellness sessions, user authentication, and secure access to protected routes.

## 🌐 Live Demo
> _Add deployment link here if available._

---

## 📁 Project Structure
Arvyax/
├── backend/ # Node.js + Express API
├── frontend/ # React 19 app (Vite + TailwindCSS)
├── test-api.js # Backend API test script


---

## 🧩 Tech Stack

### Frontend
- [React 19](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Helmet, CORS, dotenv, bcryptjs]

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud, e.g., MongoDB Atlas)

---

### 🛠 Backend Setup

```bash
cd Arvyax/backend
npm install
cp config.env.example config.env  # Create and configure your env vars
npm run dev```                       # Starts dev server with nodemon


#### Environment Variables ('config.env')

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret```


### 🎨 Frontend 

```bash
cd Arvyax/frontend
npm install
npm run dev```   # Start Vite dev server


## 🧪 Testing the API

```bash
node test-api.js```