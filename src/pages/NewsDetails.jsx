import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, FileText, Eye, Share2, Video, Mail, Sparkles } from 'lucide-react';
import LottieLoader from '../components/LottieLoader';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { newsAPI } from '../services/api';

const NewsDetails = () => {
  const { userId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionContent, setActionContent] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Get video URL from environment variable (for demo purposes)
  // In production, this should come from the API response
  const videoUrl = import.meta.env.VITE_DEMO_VIDEO_URL || "";

  useEffect(() => {
    fetchProjectDetails();
  }, [userId, projectId]);

  // Debug: Log project data structure and ensure rendering
  useEffect(() => {
    if (project) {
      console.log('Project data structure:', project);
      if (project.images) {
        console.log('Images structure:', project.images);
        project.images.forEach((img, idx) => {
          console.log(`Image ${idx}:`, img);
        });
      }
      
      // Force a re-render by ensuring dataReady is set
      if (!dataReady) {
        setTimeout(() => {
          setDataReady(true);
        }, 50);
      }
    }
  }, [project, dataReady]);

  // Reset dataReady when params change
  useEffect(() => {
    setDataReady(false);
  }, [userId, projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      setDataReady(false);
      console.log(`Fetching project details for user ${userId}, project ${projectId}`);
      
      const projectData = await newsAPI.getProjectDetails(userId, projectId);
      console.log('Project data received:', projectData);
      
      if (!projectData) {
        throw new Error('No project data received');
      }
      
      setProject(projectData);
      
      // Check if project has all necessary data before marking as ready
      const hasBasicData = projectData.id && projectData.name;
      const hasContent = projectData.analysis || projectData.content || projectData.summary;
      
      if (hasBasicData && hasContent) {
        setTimeout(() => {
          setDataReady(true);
        }, 500);
      } else {
        console.warn('Project data incomplete, marking as ready anyway');
        setDataReady(true);
      }
      
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError(err.message || 'Failed to load project details');
      setDataReady(true); // Set dataReady even on error to prevent infinite loading
    } finally {
      setLoading(false);
    }
  };  // Helper function to extract location from title or context
  const getLocationFromTitle = (title, context) => {
    if (!title) return 'Unknown Location';
    
    // Common location patterns
    const locationPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z][a-z]+)/g, // City, Country
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g // Just location names
    ];
    
    for (const pattern of locationPatterns) {
      const matches = title.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0];
      }
    }
    
    return 'Crisis Location';
  };

  // Helper function to get image description based on upload index
  const getImageDescription = (image, index) => {
    if (!image.image_description) {
      return image.filename || `Image ${index + 1}`;
    }
    
    // Split comma-separated descriptions
    const descriptions = image.image_description.split(',').map(desc => desc.trim());
    
    // Use upload_index if available, otherwise use array index
    const uploadIndex = parseInt(image.upload_index) || index;
    
    // Return the description at the upload index, or first description, or filename as fallback
    return descriptions[uploadIndex] || descriptions[0] || image.filename || `Image ${index + 1}`;
  };

  // Helper function to format document content with markdown-like styling
  const formatDocumentContent = (content) => {
    if (!content || typeof content !== 'string') {
      return content;
    }

    // Split content into lines for processing
    const lines = content.split('\n');
    const formattedElements = [];

    lines.forEach((line, index) => {
      if (!line.trim()) {
        // Empty line - add spacing
        formattedElements.push(
          <div key={`empty-${index}`} style={{ height: '0.5rem' }} />
        );
        return;
      }

      // Handle # Heading 1
      if (line.match(/^#\s+(.+)$/)) {
        const text = line.replace(/^#\s+/, '');
        formattedElements.push(
          <h1 key={`h1-${index}`} style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e3a8a', // Dark blue
            marginBottom: '1rem',
            marginTop: index > 0 ? '1.5rem' : '0',
            lineHeight: 1.3
          }}>
            {text}
          </h1>
        );
        return;
      }

      // Handle ## Heading 2
      if (line.match(/^##\s+(.+)$/)) {
        const text = line.replace(/^##\s+/, '');
        formattedElements.push(
          <h2 key={`h2-${index}`} style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#3b82f6', // Blue
            marginBottom: '0.75rem',
            marginTop: index > 0 ? '1.25rem' : '0',
            lineHeight: 1.3
          }}>
            {text}
          </h2>
        );
        return;
      }

      // Handle ### Heading 3
      if (line.match(/^###\s+(.+)$/)) {
        const text = line.replace(/^###\s+/, '');
        formattedElements.push(
          <h3 key={`h3-${index}`} style={{
            fontSize: '1.1rem',
            fontWeight: '700', // Bold
            color: '#1e3a8a', // Dark blue
            marginBottom: '0.5rem',
            marginTop: index > 0 ? '1rem' : '0',
            lineHeight: 1.3
          }}>
            {text}
          </h3>
        );
        return;
      }

      // Handle regular text with **bold** formatting
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, (match, boldText) => {
        return `<strong style="font-weight: 600; color: rgba(26, 32, 44, 0.9);">${boldText}</strong>`;
      });

      formattedElements.push(
        <p key={`p-${index}`} 
           style={{
             fontSize: '0.9rem',
             lineHeight: 1.6,
             color: 'rgba(26, 32, 44, 0.8)',
             marginBottom: '0.75rem',
             marginTop: 0
           }}
           dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });

    return <div>{formattedElements}</div>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleActionClick = async (action) => {
    // Special handling for video action only - open modal directly
    if (action === 'video') {
      setIsVideoModalOpen(true);
      return;
    }

    if (activeAction === action) {
      setActiveAction(null);
      return;
    }

    setActiveAction(action);
    setActionLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock content based on action
    let content = '';
    
    switch (action) {
      case 'social':
        content = generateSocialMediaPost();
        break;
      case 'newsletter':
        content = generateNewsletterContent();
        break;
      default:
        content = 'Content generated successfully!';
    }

    setActionContent({
      ...actionContent,
      [action]: content
    });
    
    setActionLoading(false);
  };

  const generateSocialMediaPost = () => {
    const location = getLocationFromTitle(project?.title, project?.context);
    return {
      type: 'social',
      platform: 'Multi-platform',
      content: `🚨 BREAKING: Major earthquake strikes ${location}

${project?.context || 'Devastating earthquake causes widespread damage and displacement'}

Key impacts:
• Infrastructure severely damaged
• Thousands displaced from homes  
• Emergency response teams deployed
• International aid being coordinated

Our hearts are with all those affected. 🙏

#BreakingNews #${location}Earthquake #CrisisResponse #DisasterRelief #EmergencyAlert #InternationalAid #StaySafe #PrayFor${location.replace(' ', '')}

Stay informed and follow official emergency channels for updates.`
    };
  };

  const generateVideoScript = () => {
    return {
      type: 'video',
      duration: '60 seconds',
      content: `VIDEO SCRIPT: ${project?.title}

[00:00-00:05] OPENING
"Breaking news from ${getLocationFromTitle(project?.title, project?.context)}"

[00:05-00:20] MAIN STORY
${project?.context || 'A devastating earthquake has struck the region, causing significant damage and requiring immediate emergency response.'}

[00:20-00:40] KEY DETAILS
- Emergency services responding
- Infrastructure damage reported
- Evacuation procedures underway
- International aid coordinating

[00:40-00:55] ANALYSIS
AI analysis of satellite imagery shows the full extent of the impact zone, with structural damage visible across multiple districts.

[00:55-01:00] CLOSING
"We'll continue monitoring this developing story."

VISUAL ELEMENTS:
• Satellite imagery overlay
• Damage assessment graphics
• Emergency response footage
• Data visualization charts`
    };
  };

  const generateNewsletterContent = () => {
    return {
      type: 'newsletter',
      subject: `Crisis Update: ${project?.title}`,
      content: `CRISIS JOURNALIST AI - EMERGENCY BULLETIN

Subject: ${project?.title} - Comprehensive Analysis Report

Dear Subscribers,

We're providing you with the latest AI-powered analysis of the ongoing crisis situation.

SITUATION OVERVIEW
${project?.context || 'A significant crisis event has occurred requiring immediate attention and comprehensive analysis.'}

AI ANALYSIS SUMMARY
Our advanced AI systems have processed multiple data sources including:
• Satellite imagery showing impact zones
• Official disaster reports and documentation  
• Real-time infrastructure damage assessments
• Population displacement data

KEY FINDINGS
${project?.images?.[0]?.analysis_result?.substring(0, 200) || 'Comprehensive analysis reveals significant infrastructure damage and humanitarian impact'}...

HUMANITARIAN IMPACT
${project?.documents?.[0]?.analysis_result?.substring(0, 200) || 'Current reports indicate substantial population displacement with ongoing emergency response efforts'}...

RECOMMENDED ACTIONS
1. Continue monitoring official emergency channels
2. Support verified relief organizations
3. Avoid spreading unverified information
4. Follow local evacuation procedures if in affected areas

This analysis was generated using AI-powered crisis journalism tools processing real-time data sources.

Stay safe and informed.

Crisis Journalist AI Team
Generated on: ${formatDate(new Date().toISOString())}

---
For more updates, visit our dashboard or follow our emergency alerts.`
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
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

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const actionVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    active: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  if (loading || !dataReady) {
    return (
      <motion.div 
        className="news-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: '#ffffff'
        }}
      >
        <LottieLoader 
          size={120}
          text="Loading crisis analysis..."
          subtitle="Fetching detailed information..."
        />
      </motion.div>
    );
  }

  if (error && !project) {
    return (
      <motion.div 
        className="news-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem' }}
      >
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <motion.button
            onClick={fetchProjectDetails}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Retry
          </motion.button>
          <motion.button
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </motion.button>
        </div>
        
        <motion.div 
          className="error"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            padding: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: 'rgba(239, 68, 68, 0.9)',
            textAlign: 'center'
          }}
        >
          <h3>Unable to Load Project Details</h3>
          <p>{error}</p>
        </motion.div>
      </motion.div>
    );
  }

  // Show loading if project is still null or data not ready
  if ((!project || !dataReady) && !loading && !error) {
    return (
      <motion.div 
        className="news-details"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: '#ffffff'
        }}
      >
        <LottieLoader 
          size={120}
          text="Preparing content..."
          subtitle="Almost ready..."
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="news-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'block',
        visibility: 'visible'
      }}
    >
      {error && (
        <motion.div 
          className="error"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div 
        className="news-details-header"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          display: 'block',
          visibility: 'visible',
          position: 'relative',
          zIndex: 2
        }}
      >
        <motion.h1 
          className="news-details-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {project?.title || project?.project_id}
        </motion.h1>
        <motion.div 
          className="news-meta"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <MapPin size={16} />
            {getLocationFromTitle(project?.title, project?.context)}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Calendar size={16} />
            {formatDate(project?.created_at)}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={16} />
            {project?.metadata?.total_files || 0} files analyzed
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Images Section */}
      {project?.images && project.images.length > 0 && (
        <motion.div 
          className="images-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.h3 
            className="section-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Eye size={24} style={{ marginRight: '0.5rem' }} />
            Satellite & Ground Images
          </motion.h3>
          <motion.div 
            className="images-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {project.images && project.images.map((image, index) => {
              // Handle both old format (object key-value) and new API format (direct object)
              let imageUrl, imageName, imageDescription, analysisResult;
              
              if (image.presigned_url || image.s3_url) {
                // New API format with full image object - prioritize presigned URL
                imageUrl = image.presigned_url || image.s3_url;
                imageName = image.filename;
                analysisResult = image.analysis_result;
                imageDescription = getImageDescription(image, index);
                console.log(`NewsDetails image ${index} URL:`, imageUrl);
              } else {
                // Old format - object with key-value pairs
                imageUrl = Object.values(image)[0];
                imageName = Object.keys(image)[0];
                imageDescription = imageName;
              }
              
              return (
                <motion.div 
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <motion.div 
                    className="news-details-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={imageDescription}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ display: imageUrl ? 'none' : 'flex' }}>
                      📸 {imageDescription || `Image ${index + 1}`}
                    </div>
                  </motion.div>
                  
                  {/* AI Analysis Result - Simple text without boxes */}
                  {analysisResult && (
                    <motion.div
                      style={{
                        marginTop: '1rem',
                        textAlign: 'left'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <p style={{ 
                        fontSize: '0.85rem', 
                        lineHeight: 1.6, 
                        color: 'rgba(26, 32, 44, 0.8)',
                        margin: 0
                      }}>
                        {analysisResult}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Content Analysis Section */}
      <motion.div 
        className="content-section"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.h3 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          AI Analysis Report
        </motion.h3>
        
        <motion.div 
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Context Overview
          </h4>
          <p style={{ lineHeight: 1.7, color: 'rgba(26, 32, 44, 0.8)' }}>
            {project?.context || 'This crisis event has been analyzed using advanced AI systems to provide comprehensive insights and situational awareness.'}
          </p>
        </motion.div>

        {project?.metadata?.image_count > 0 && (
          <motion.div 
            style={{ marginBottom: '2rem' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Visual Analysis Summary
            </h4>
            <p style={{ lineHeight: 1.7, color: 'rgba(26, 32, 44, 0.8)' }}>
              {project.metadata.image_count} images have been analyzed for this crisis event. The visual data provides crucial insights into the situation on the ground.
            </p>
          </motion.div>
        )}

        {project?.documents && project.documents.length > 0 && (
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Document Analysis
            </h4>
            {project.documents.map((doc, index) => (
              <motion.div 
                key={index} 
                style={{ marginBottom: '2rem' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  {formatDocumentContent(doc.analysis_result || 'Analysis results not available')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons Section */}
      <motion.div 
        className="actions-section"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.h3 
          className="section-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Generate Content
        </motion.h3>
        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.button
            className={`action-btn ${activeAction === 'social' ? 'active' : ''}`}
            onClick={() => handleActionClick('social')}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={20} />
            Social Media Feed
          </motion.button>
          
          <motion.button
            className={`action-btn ${activeAction === 'video' ? 'active' : ''}`}
            onClick={() => handleActionClick('video')}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video size={20} />
            Short Video Script
          </motion.button>
          
          <motion.button
            className={`action-btn ${activeAction === 'newsletter' ? 'active' : ''}`}
            onClick={() => handleActionClick('newsletter')}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={20} />
            Newsletter
          </motion.button>
        </motion.div>

        {/* Action Content */}
        <AnimatePresence mode="wait">
          {activeAction && (
            <motion.div 
              className="action-content"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {actionLoading ? (
                <LottieLoader 
                  size={60}
                  text={`Generating ${activeAction} content...`}
                  subtitle="Taking some time..."
                />
              ) : (
                actionContent[activeAction] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textTransform: 'capitalize', background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {actionContent[activeAction].type === 'social' && '📱 Social Media Post'}
                      {actionContent[activeAction].type === 'video' && '🎥 Video Script'}
                      {actionContent[activeAction].type === 'newsletter' && '📧 Newsletter Content'}
                    </h4>
                    
                    {actionContent[activeAction].subject && (
                      <div style={{ marginBottom: '1rem', color: 'rgba(26, 32, 44, 0.8)' }}>
                        <strong>Subject:</strong> {actionContent[activeAction].subject}
                      </div>
                    )}
                    
                    {actionContent[activeAction].platform && (
                      <div style={{ marginBottom: '1rem', color: 'rgba(26, 32, 44, 0.8)' }}>
                        <strong>Platform:</strong> {actionContent[activeAction].platform}
                      </div>
                    )}
                    
                    {actionContent[activeAction].duration && (
                      <div style={{ marginBottom: '1rem', color: 'rgba(26, 32, 44, 0.8)' }}>
                        <strong>Duration:</strong> {actionContent[activeAction].duration}
                      </div>
                    )}
                    
                    <div style={{ 
                      background: 'rgba(240, 245, 255, 0.8)', 
                      padding: '1.5rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(30, 58, 138, 0.2)',
                      whiteSpace: 'pre-line',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'rgba(26, 32, 44, 0.9)'
                    }}>
                      {actionContent[activeAction].content}
                    </div>
                    
                    <motion.div 
                      style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: 'rgba(34, 197, 94, 0.1)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        fontSize: '0.875rem',
                        color: 'rgba(15, 118, 110, 0.9)'
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✅ Content generated successfully! You can copy and use this content across your platforms.
                    </motion.div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={`Crisis Report: ${project?.title || 'Breaking News'}`}
      />
    </motion.div>
  );
};

export default NewsDetails;