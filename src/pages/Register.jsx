import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import LottieCarousel from '../components/LottieCarousel';
import authService from '../services/authService';

const Register = ({ onRegisterSuccess, onShowLogin }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Lottie animation file paths from public directory
  const lottieAnimations = [
    '/User Profile.json',
    '/Startup and teamwork concept web banner.json',
    '/Company employees sharing thoughts and ideas.json'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });
      
      console.log('Registration successful:', response);
      
      // Call parent success handler with user data
      if (onRegisterSuccess) {
        onRegisterSuccess(response.user);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Lottie Carousel */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          width: '50%', 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <LottieCarousel 
          animations={lottieAnimations}
          autoPlay={true}
          interval={5000}
        />
      </motion.div>

      {/* Right Side - Register Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          width: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem',
          background: '#f9fafb',
          overflowY: 'auto'
        }}
      >
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem' 
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #ffffffff 0%, #ffffff 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                overflow: 'hidden'
              }}>
                <img 
                  src="/favicon.ico" 
                  alt="Crisis Journalist AI" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain'
                  }} 
                />
              </div>
            </div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Join Crisis Journalist AI
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Create your account to get started
            </p>
          </motion.div>

          {/* Register Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ 
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '2rem'
            }}
          >
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              textAlign: 'center',
              marginBottom: '0.5rem',
              color: '#111827'
            }}>
              Create Account
            </h2>
            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              marginBottom: '2rem',
              fontSize: '0.875rem'
            }}>
              Fill in your details to create a new account
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#dc2626'
                }}
              >
                <AlertCircle size={18} />
                <span style={{ fontSize: '0.875rem' }}>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Full Name Field */}
              <div>
                <label 
                  htmlFor="full_name" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} 
                  />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${validationErrors.full_name ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => !validationErrors.full_name && (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => !validationErrors.full_name && (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                {validationErrors.full_name && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {validationErrors.full_name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} 
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${validationErrors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => !validationErrors.email && (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => !validationErrors.email && (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                {validationErrors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} 
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${validationErrors.password ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => !validationErrors.password && (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => !validationErrors.password && (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                {validationErrors.password && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: '#9ca3af'
                    }} 
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${validationErrors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => !validationErrors.confirmPassword && (e.target.style.borderColor = '#7c3aed')}
                    onBlur={(e) => !validationErrors.confirmPassword && (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: isSubmitting 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onShowLogin}
                  disabled={isSubmitting}
                  style={{
                    color: '#7c3aed',
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    textDecoration: 'none',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle size={18} style={{ color: '#059669', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.875rem', color: '#047857', margin: 0 }}>
                <strong>Ready in seconds!</strong> After registration, you can start analyzing crisis news immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
