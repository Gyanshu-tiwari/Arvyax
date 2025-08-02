import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MySessions } from './pages/MySessions';
import { SessionEditor } from './pages/SessionEditor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/my-sessions" element={
              <ProtectedRoute>
                <MySessions />
              </ProtectedRoute>
            } />
            
            <Route path="/create-session" element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } />
            
            <Route path="/edit-session/:id" element={
              <ProtectedRoute>
                <SessionEditor />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
