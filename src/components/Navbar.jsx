import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PlusCircle, Zap } from 'lucide-react';
import Lottie from 'lottie-react';
import waterFillsSquareData from '../animations/background lines wave.json';

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
          <Link to="/">
            <img 
              src="/logo.png" 
              alt="Crisis Journalist AI Logo" 
              style={{
                display: 'block',
                width: 'auto',
                height: '60px',
                maxWidth: 'none',
                maxHeight: 'none',
                border: 'none',
                background: 'none',
                padding: 0,
                margin: 0
              }}
            />
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
      
      {/* Water Animation at Bottom */}
      <div className="navbar-bottom">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        >
          <Lottie 
            animationData={waterFillsSquareData}
            loop={true}
            autoplay={true}
            style={{
              width: '100%',
              height: '490px',
              objectFit: 'cover'
            }}
          />
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;