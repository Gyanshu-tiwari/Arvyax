# Arvyax Wellness Backend API

A robust Node.js + Express + MongoDB backend for the Arvyax Wellness Sessions platform.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Session Management**: Full CRUD operations for wellness sessions
- **User Management**: User registration, login, profile updates
- **Advanced Search**: Search sessions by title, description, and tags
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Helmet.js security headers, CORS protection

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the config file and update with your values:

```bash
cp config.env.example config.env
```

Update the following variables in `config.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/arvyax_wellness

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatedetails` | Update user details | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Session Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/sessions` | Get public sessions | Public |
| GET | `/api/sessions/:id` | Get single session | Public |
| GET | `/api/sessions/my-sessions` | Get user's sessions | Private |
| POST | `/api/sessions` | Create new session | Private |
| PUT | `/api/sessions/:id` | Update session | Private |
| DELETE | `/api/sessions/:id` | Delete session | Private |
| PUT | `/api/sessions/:id/publish` | Publish session | Private |
| PUT | `/api/sessions/:id/like` | Like/unlike session | Private |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## 🔐 Authentication

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Using JWT Token

Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String,
  avatar: String,
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

### Session Model

```javascript
{
  user: ObjectId (ref: 'User'),
  title: String (required),
  description: String (required),
  tags: [String],
  json_file_url: String,
  status: String (enum: ['draft', 'published']),
  duration: String,
  difficulty: String (enum: ['beginner', 'intermediate', 'advanced']),
  category: String (enum: ['yoga', 'meditation', 'fitness', 'wellness', 'breathing', 'stretching', 'other']),
  likes: [ObjectId (ref: 'User')],
  views: Number,
  isFeatured: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

## 🔍 Search & Filtering

### Public Sessions Query Parameters

- `search`: Search in title, description, and tags
- `category`: Filter by category
- `difficulty`: Filter by difficulty level
- `page`: Page number for pagination
- `limit`: Number of items per page

Example:
```
GET /api/sessions?search=yoga&category=wellness&page=1&limit=10
```

## 🛡 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configured for frontend origin
- **Helmet.js**: Security headers
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arvyax_wellness
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Platforms

- **Render**: Easy deployment with automatic HTTPS
- **Railway**: Simple deployment with MongoDB integration
- **Heroku**: Traditional deployment platform
- **DigitalOcean**: VPS deployment option

## 🧪 Testing

Run the health check to verify the API is working:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Arvyax Wellness API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Project Structure

```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── config.env      # Environment variables
├── package.json    # Dependencies
├── server.js       # Main server file
└── README.md       # Documentation
```

### Adding New Features

1. Create controller in `controllers/`
2. Add routes in `routes/`
3. Update models if needed
4. Test with Postman or similar tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review error logs
- Test with Postman collection
- Create an issue in the repository 