/**
 * CreateNews Component - Crisis Journalism AI File Upload
 * 
 * USER ID SYSTEM:
 * - Uses a FIXED user ID '101' for all uploads (not unique per session)
 * - This means ALL uploads are associated with the same user account
 * - All projects created will be under user '101' in the database
 * - To implement unique users, you would need to:
 *   1. Generate unique IDs: const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
 *   2. Store in localStorage/sessionStorage for persistence
 *   3. Or implement proper user authentication
 * 
 * CURRENT BEHAVIOR:
 * - Same user sees all previously uploaded projects
 * - Projects are shared across all app sessions
 * - No user isolation (all data under user '101')
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, FileImage, FileText, FileSpreadsheet, Sparkles } from 'lucide-react';
import LottieLoader from '../components/LottieLoader';
import FullPageLoader from '../components/FullPageLoader';
import SuccessLoader from '../components/SuccessLoader';
import { newsAPI } from '../services/api';

const CreateNews = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const excelInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    context: '',
    imageDescriptions: ''
  });

  const [files, setFiles] = useState({
    images: [],
    documents: [],
    excel: null
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState({
    images: false,
    documents: false,
    excel: false
  });

  // FIXED USER ID: '101' - All uploads use the same user account
  // Change this to implement unique users per session if needed
  const userId = '101';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (type === 'images') {
      const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setFiles(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }));
      }
      if (imageFiles.length !== droppedFiles.length) {
        setError('Some files were not images and were filtered out.');
      }
    } else if (type === 'documents') {
      const docFiles = droppedFiles.filter(file => 
        file.type === 'text/plain' || 
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.txt') ||
        file.name.toLowerCase().endsWith('.pdf')
      );
      if (docFiles.length > 0) {
        setFiles(prev => ({ ...prev, documents: [...prev.documents, ...docFiles] }));
      }
      if (docFiles.length !== droppedFiles.length) {
        setError('Some files were not supported documents and were filtered out.');
      }
    } else if (type === 'excel') {
      const excelFile = droppedFiles.find(file => 
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.toLowerCase().endsWith('.xls') ||
        file.name.toLowerCase().endsWith('.xlsx')
      );
      if (excelFile) {
        setFiles(prev => ({ ...prev, excel: excelFile }));
      } else {
        setError('Please drop a valid Excel file (.xls or .xlsx)');
      }
    }
  };

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError('Some files were not images and were filtered out.');
    }

    setFiles(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }));
  };

  const handleDocumentSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const docFiles = selectedFiles.filter(file => 
      file.type === 'text/plain' || 
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.txt') ||
      file.name.toLowerCase().endsWith('.pdf')
    );

    if (docFiles.length !== selectedFiles.length) {
      setError('Some files were not supported documents and were filtered out.');
    }

    setFiles(prev => ({
      ...prev,
      documents: [...prev.documents, ...docFiles]
    }));
  };

  const handleExcelSelect = (e) => {
    const file = e.target.files[0];
    if (file && (
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.toLowerCase().endsWith('.xls') ||
      file.name.toLowerCase().endsWith('.xlsx')
    )) {
      setFiles(prev => ({
        ...prev,
        excel: file
      }));
    } else {
      setError('Please select a valid Excel file (.xls or .xlsx)');
    }
  };

  const removeImage = (index) => {
    setFiles(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index) => {
    setFiles(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const removeExcel = () => {
    setFiles(prev => ({
      ...prev,
      excel: null
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }

    if (files.images.length === 0 && files.documents.length === 0 && !files.excel) {
      setError('At least one file (image, document, or Excel) must be uploaded');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitFormData = new FormData();
      
      // Add form fields
      submitFormData.append('user_id', userId);
      submitFormData.append('title', formData.title.trim());
      
      if (formData.context.trim()) {
        submitFormData.append('context', formData.context.trim());
      }
      
      // Add image descriptions if provided
      if (formData.imageDescriptions.trim()) {
        submitFormData.append('image_descriptions', formData.imageDescriptions.trim());
      }

      // Add images with proper field names
      files.images.forEach((file, index) => {
        submitFormData.append('images', file, file.name);
      });

      // Add documents with proper field names
      files.documents.forEach((file, index) => {
        submitFormData.append('documents', file, file.name);
      });

      // Add Excel file with proper field name
      if (files.excel) {
        submitFormData.append('excel', files.excel, files.excel.name);
      }

      // Log form data for debugging
      console.log('Submitting form data for user:', userId);
      for (let pair of submitFormData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `${pair[1].name} (${pair[1].size} bytes)` : pair[1]));
      }

      const response = await newsAPI.uploadFiles(submitFormData);
      
      if (response && (response.status === 'success' || response.db_reference)) {
        // Show success state
        setLoading(false);
        setSuccess(true);
        
        // Wait for user to see success message, then navigate
        setTimeout(() => {
          // Extract project ID from response
          const projectId = response.db_reference 
            ? response.db_reference.split('#PROJECT#')[1] 
            : response.project_id;
          
          if (projectId) {
            // Navigate to the news details page
            navigate(`/news/${userId}/${projectId}`);
          } else {
            // If no project ID, navigate to dashboard
            navigate('/dashboard');
          }
        }, 2500);
        
      } else {
        throw new Error(response?.message || 'Upload completed but response format is unexpected');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please check your files and try again.');
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  const hasFiles = files.images.length > 0 || files.documents.length > 0 || files.excel;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const uploadAreaVariants = {
    idle: { scale: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
    hover: { 
      scale: 1.02, 
      borderColor: 'rgba(102, 126, 234, 0.6)',
      transition: { duration: 0.3 }
    },
    dragover: { 
      scale: 1.05, 
      borderColor: 'rgba(102, 126, 234, 0.8)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="create-news"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="dashboard-header" variants={itemVariants}>
        <h1 className="dashboard-title">
          Create News Analysis
          <motion.span 
            style={{ marginLeft: '1rem' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles size={32} />
          </motion.span>
        </h1>
        <p className="dashboard-subtitle">
          Upload images, documents, and Excel files for AI-powered crisis analysis
        </p>
      </motion.div>

      {error && (
        <motion.div 
          className="error" 
          variants={itemVariants}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
        >
          {error}
        </motion.div>
      )}



      <motion.form 
        onSubmit={handleSubmit} 
        className="form-section"
        variants={itemVariants}
      >
        {/* Title Input */}
        <div className="form-group">
          <label className="form-label">News Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter news title..."
            required
          />
        </div>

        {/* Context Input */}
        <div className="form-group">
          <label className="form-label">Context Description</label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="Provide context about the crisis or event..."
          />
        </div>

        {/* Image Descriptions Input */}
        <div className="form-group">
          <label className="form-label">Image Descriptions</label>
          <input
            type="text"
            name="imageDescriptions"
            value={formData.imageDescriptions}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Comma-separated descriptions for each image (optional)..."
          />
          <small style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            Example: "satellite view,building damage" - descriptions will be mapped to images by upload order
          </small>
        </div>

        {/* Image Upload */}
        <motion.div className="form-group" variants={itemVariants}>
          <label className="form-label">Images</label>
          <motion.div 
            className={`file-upload-area ${dragOver.images ? 'dragover' : ''}`}
            variants={uploadAreaVariants}
            whileHover="hover"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => handleDragOver(e, 'images')}
            onDragLeave={(e) => handleDragLeave(e, 'images')}
            onDrop={(e) => handleDrop(e, 'images')}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileImage size={48} className="upload-icon" />
            </motion.div>
            <p className="upload-text">
              {dragOver.images ? 'Drop images here' : 'Click or drag to upload images'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(26, 32, 44, 0.6)' }}>
              Supports: JPG, JPEG, PNG, GIF, BMP, WEBP
            </p>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="file-input"
          />
          
          {files.images.length > 0 && (
            <motion.div 
              className="image-preview-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {files.images.map((file, index) => (
                <motion.div 
                  key={index} 
                  className="image-preview"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index + 1}`}
                  />
                  <motion.button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Document Upload */}
        <div className="form-group">
          <label className="form-label">Documents</label>
          <div 
            className={`file-upload-area ${dragOver.documents ? 'dragover' : ''}`}
            onClick={() => docInputRef.current?.click()}
            onDragOver={(e) => handleDragOver(e, 'documents')}
            onDragLeave={(e) => handleDragLeave(e, 'documents')}
            onDrop={(e) => handleDrop(e, 'documents')}
          >
            <FileText size={48} className="upload-icon" />
            <p className="upload-text">
              {dragOver.documents ? 'Drop documents here' : 'Click or drag to upload documents'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(26, 32, 44, 0.6)' }}>
              Supports: TXT, PDF
            </p>
          </div>
          <input
            ref={docInputRef}
            type="file"
            multiple
            accept=".txt,.pdf,text/plain,application/pdf"
            onChange={handleDocumentSelect}
            className="file-input"
          />
          
          {files.documents.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              {files.documents.map((file, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Excel Upload */}
        <div className="form-group">
          <label className="form-label">Excel Data</label>
          <div 
            className={`file-upload-area ${dragOver.excel ? 'dragover' : ''}`}
            onClick={() => excelInputRef.current?.click()}
            onDragOver={(e) => handleDragOver(e, 'excel')}
            onDragLeave={(e) => handleDragLeave(e, 'excel')}
            onDrop={(e) => handleDrop(e, 'excel')}
          >
            <FileSpreadsheet size={48} className="upload-icon" />
            <p className="upload-text">
              {dragOver.excel ? 'Drop Excel file here' : 'Click or drag to upload Excel file'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(26, 32, 44, 0.6)' }}>
              Supports: XLS, XLSX
            </p>
          </div>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleExcelSelect}
            className="file-input"
          />
          
          {files.excel && (
            <div style={{ 
              marginTop: '1rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.5rem',
              background: '#f3f4f6',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '0.875rem' }}>{files.excel.name}</span>
              <button
                type="button"
                onClick={removeExcel}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="generate-btn"
          disabled={loading || !hasFiles || !formData.title.trim()}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? 'Processing...' : 'Generate News Analysis'}
        </motion.button>
      </motion.form>

      {/* Loading Overlay - shows page underneath with reduced opacity */}
      <FullPageLoader 
        isVisible={loading}
        text="Generating Crisis Analysis..."
        subtitle="Analyzing your files with AI..."
      />

      {/* Success Overlay - shows after successful upload */}
      <SuccessLoader 
        isVisible={success}
        message="Analysis Complete!"
        subtitle="Your crisis analysis has been generated successfully"
      />
    </motion.div>
  );
};

export default CreateNews;