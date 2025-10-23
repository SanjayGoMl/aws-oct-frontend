import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateNews from './pages/CreateNews';
import NewsDetails from './pages/NewsDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import authService from './services/authService';
import './App.css';

const AnimatedRoutes = ({ isAuthenticated, user }) => {
  const location = useLocation();

  const pageVariants = {
    initial: { 
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="page-container"
      >
        <Routes location={location}>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-news" 
            element={
              <ProtectedRoute>
                <CreateNews user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/news/:userId/:projectId" 
            element={
              <ProtectedRoute>
                <NewsDetails user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/news/:userId/:projectId/" 
            element={
              <ProtectedRoute>
                <NewsDetails user={user} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #06b6d4 100%)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            color: 'white'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Crisis Journalist AI</h2>
          <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Loading...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated, show auth pages
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onShowRegister={() => setShowLogin(false)} 
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              <Register 
                onRegisterSuccess={handleRegisterSuccess} 
                onShowLogin={() => setShowLogin(true)} 
              />
            } 
          />
          <Route 
            path="*" 
            element={
              showLogin ? (
                <Login 
                  onLoginSuccess={handleLoginSuccess} 
                  onShowRegister={() => setShowLogin(false)} 
                />
              ) : (
                <Register 
                  onRegisterSuccess={handleRegisterSuccess} 
                  onShowLogin={() => setShowLogin(true)} 
                />
              )
            } 
          />
        </Routes>
      </Router>
    );
  }

  // If authenticated, show main app
  return (
    <Router>
      <motion.div 
        className="App"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <AnimatedRoutes isAuthenticated={isAuthenticated} user={user} />
        </main>
      </motion.div>
    </Router>
  );
}

export default App;
