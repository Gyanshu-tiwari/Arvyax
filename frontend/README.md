# Arvyax Wellness Sessions

A beautiful, full-stack wellness session management application built with React, Vite, and Tailwind CSS.

## 🌟 Features

### Authentication
- **User Registration & Login**: Secure authentication with JWT tokens
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Persistent Sessions**: JWT tokens stored in localStorage

### Session Management
- **Dashboard**: Browse and discover published wellness sessions
- **Search & Filter**: Find sessions by title, description, or tags
- **My Sessions**: Manage your own sessions (drafts and published)
- **Session Editor**: Create and edit sessions with auto-save functionality

### Advanced Features
- **Auto-save**: Automatically saves drafts after 5 seconds of inactivity
- **Real-time Feedback**: Visual indicators for save status
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios (ready for backend integration)

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthContext.jsx      # Authentication context
│   ├── ProtectedRoute.jsx   # Route protection component
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Main dashboard
│   ├── MySessions.jsx      # User's sessions management
│   └── SessionEditor.jsx   # Session creation/editing
├── services/
│   └── api.js             # Mock API service
├── App.jsx                # Main app component
└── main.jsx              # App entry point
```

## 🎯 Core Features Implementation

### Authentication Flow
1. **Registration**: Users can create new accounts
2. **Login**: Secure authentication with JWT tokens
3. **Token Management**: Automatic token storage and verification
4. **Logout**: Secure session termination

### Session Management
1. **Create Sessions**: Rich form with title, description, tags, and JSON file URL
2. **Auto-save**: Automatic draft saving every 5 seconds
3. **Draft vs Published**: Separate management of draft and published sessions
4. **Edit Sessions**: Full editing capabilities for existing sessions

### User Experience
1. **Responsive Design**: Mobile-first approach with Tailwind CSS
2. **Loading States**: Smooth loading indicators throughout the app
3. **Error Handling**: Comprehensive error messages and validation
4. **Visual Feedback**: Auto-save status indicators and success messages

## 🔧 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd arvyax-curser/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
For testing purposes, you can use:
- **Email**: `user@example.com`
- **Password**: `password123`

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#3B82F6` to `#8B5CF6`)
- **Secondary**: Purple accents
- **Success**: Green (`#22C55E`)
- **Warning**: Yellow (`#EAB308`)
- **Error**: Red (`#EF4444`)

### Typography
- **Font**: System fonts with Tailwind's font stack
- **Headings**: Bold weights for hierarchy
- **Body**: Regular weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Glass-effect navbar with dropdown menus

## 🔌 API Integration

The application is currently using a mock API service (`src/services/api.js`) that simulates backend functionality. To integrate with a real backend:

1. **Replace mock API calls** in `src/services/api.js`
2. **Update authentication endpoints** in `src/components/AuthContext.jsx`
3. **Configure API base URL** and headers
4. **Implement proper error handling** for network requests

### Expected API Endpoints
```
POST /api/register     # User registration
POST /api/login        # User authentication
GET  /api/sessions     # Public sessions
GET  /api/my-sessions  # User's sessions
POST /api/sessions     # Create session
PUT  /api/sessions/:id # Update session
POST /api/sessions/:id/publish # Publish session
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository to Vercel or Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Live editing with multiple users
- **Session Templates**: Pre-built session templates
- **Advanced Search**: Full-text search with filters
- **User Profiles**: Detailed user profiles and preferences
- **Notifications**: Real-time notifications for session updates
- **Analytics**: Session usage and engagement metrics

### Technical Improvements
- **Backend Integration**: Full Node.js/Express backend
- **Database**: MongoDB Atlas integration
- **Real-time**: WebSocket integration for live features
- **Testing**: Comprehensive test suite
- **PWA**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Tailwind CSS** for the beautiful styling system
- **Lucide React** for the amazing icons
- **React Router** for seamless navigation
- **Vite** for the fast development experience

---

**Built with ❤️ for the Arvyax wellness community**
