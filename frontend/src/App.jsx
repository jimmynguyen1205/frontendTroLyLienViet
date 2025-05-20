import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import TrainerPage from './pages/TrainerPage'
import './App.css'
import api from './services/api';

function Navbar({ isLoggedIn, role, onLogout }) {
  return (
    <nav className="bg-white shadow mb-4">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <Link to="/chat" className="text-indigo-600 font-semibold hover:underline">Chat</Link>
          )}
          {role === 'trainer' && (
            <Link to="/trainer" className="text-indigo-600 font-semibold hover:underline">Trainer</Link>
          )}
        </div>
        {isLoggedIn && (
          <button onClick={onLogout} className="text-sm text-gray-600 hover:text-red-600">Đăng xuất</button>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem('token')
  )
  const [role, setRole] = React.useState(null);
  const navigate = useNavigate ? useNavigate() : null;

  React.useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRole(null);
        return;
      }
      try {
        const res = await api.get('/auth/verify');
        setRole(res.role);
      } catch {
        setRole(null);
      }
    };
    if (isLoggedIn) fetchRole();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole(null);
    if (navigate) navigate('/login');
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} role={role} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/chat" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route 
            path="/chat" 
            element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} 
          />
          {role === 'trainer' && (
            <Route 
              path="/trainer" 
              element={<TrainerPage />} 
            />
          )}
          <Route 
            path="/" 
            element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
