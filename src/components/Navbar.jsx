import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PlusCircle, Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hover: { 
      x: 6,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.nav 
      className="navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-header">
        <motion.div
          variants={logoVariants}
          whileHover="hover"
        >
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Zap size={22} color="white" />
            </div>
            Crisis Journalist AI
          </Link>
        </motion.div>
      </div>
      
      <div className="nav-items">
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <Home size={20} />
            Dashboard
          </Link>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link 
            to="/create-news" 
            className={`nav-item ${location.pathname === '/create-news' ? 'active' : ''}`}
          >
            <PlusCircle size={20} />
            Create News
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;