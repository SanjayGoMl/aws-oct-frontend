import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import ParticleWave from '../components/ParticleWave';
import LottieLoader from '../components/LottieLoader';
import { newsAPI } from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentContents, setDocumentContents] = useState({});

  // Fixed user ID for all projects - consistent across the app
  const userId = '101';

  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to fetch document content from URL
  const fetchDocumentContent = async (url, projectId, docKey) => {
    try {
      const cacheKey = `${projectId}_${docKey}`;
      
      // If it's an S3 URL, try to convert it to HTTP URL
      let fetchUrl = url;
      if (url.startsWith('s3://')) {
        // Convert s3://bucket/path to https://bucket.s3.amazonaws.com/path
        const s3Path = url.replace('s3://', '');
        const [bucket, ...pathParts] = s3Path.split('/');
        fetchUrl = `https://${bucket}.s3.amazonaws.com/${pathParts.join('/')}`;
      }
      
      console.log(`Attempting to fetch from: ${fetchUrl}`);
      
      // Try multiple approaches for CORS-restricted URLs
      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'text/plain, text/html, application/json, */*',
        }
      });
      
      if (response.ok) {
        const content = await response.text();
        console.log(`Successfully fetched content for ${docKey}:`, content.substring(0, 200));
        setDocumentContents(prev => ({
          ...prev,
          [cacheKey]: content
        }));
        return content;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error fetching document content from ${url}:`, error);
      
      // Set a fallback message indicating content couldn't be loaded
      const cacheKey = `${projectId}_${docKey}`;
      setDocumentContents(prev => ({
        ...prev,
        [cacheKey]: `Unable to load content from ${docKey}. Document may be restricted or unavailable.`
      }));
    }
    return null;
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching projects for user: ${userId}`);
      
      // First, get the list of projects for the user
      const projectsList = await newsAPI.getUserProjects(userId, 50);
      console.log('Projects list response:', projectsList);
      
      if (!projectsList || !projectsList.projects || projectsList.projects.length === 0) {
        console.log('No projects found for user');
        setProjects([]);
        setError(null);
        return;
      }
      
      // Extract project IDs from the list
      const projectIds = projectsList.projects.map(project => project.project_id);
      console.log('Found project IDs:', projectIds);
      
      // Fetch detailed information for each project
      const projectPromises = projectIds.map(projectId => 
        newsAPI.getProjectDetails(userId, projectId).catch(error => {
          console.error(`Failed to fetch details for project ${projectId}:`, error);
          return null; // Return null for failed requests
        })
      );
      
      const projectResults = await Promise.allSettled(projectPromises);
      
      const successfulProjects = projectResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);
        
      console.log(`Successfully loaded ${successfulProjects.length} projects out of ${projectIds.length}`);
      setProjects(successfulProjects);
      
      // Debug: Log project structure to understand document format
      successfulProjects.forEach((project, index) => {
        console.log(`Project ${index} (${project.project_id}):`, project);
        if (project.documents) {
          console.log(`Documents for ${project.project_id}:`, project.documents);
        }
      });
      
      // Fetch document contents for projects that have documents
      successfulProjects.forEach(project => {
        if (project.documents && project.documents.length > 0) {
          project.documents.forEach((doc, index) => {
            const docKey = Object.keys(doc)[0];
            const docValue = Object.values(doc)[0];
            
            console.log(`Document ${index} for ${project.project_id}:`, { key: docKey, value: docValue });
            
            // If the document value is a URL, fetch its content
            if (typeof docValue === 'string' && (docValue.startsWith('http') || docValue.startsWith('s3://'))) {
              console.log(`Fetching content for URL: ${docValue}`);
              fetchDocumentContent(docValue, project.project_id, docKey);
            }
          });
        }
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Using demo data.');
      // Fallback to demo data if API fails
      setProjects([
        {
          project_id: 'demo_1',
          title: 'Philippines Earthquake',
          created_at: '2025-10-15T12:11:42.217295Z',
          context: 'Major earthquake hits central Philippines causing widespread damage',
          has_images: true,
          image_count: 2,
          location: 'Philippines'
        },
        {
          project_id: 'demo_2',
          title: 'Uttarakhand Floods',
          created_at: '2025-10-15T07:41:43.921372Z',
          context: 'Heavy monsoon rains trigger severe flooding in Uttarakhand state',
          has_images: true,
          image_count: 1,
          location: 'India'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationFromTitle = (title, context = '') => {
    const text = `${title} ${context}`.toLowerCase();
    if (text.includes('philippines') || text.includes('philippine')) return 'Philippines';
    if (text.includes('india') || text.includes('uttarakhand') || text.includes('delhi')) return 'India';
    if (text.includes('japan') || text.includes('tokyo')) return 'Japan';
    if (text.includes('usa') || text.includes('america') || text.includes('california')) return 'America';
    return 'Global';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getDocumentPreview = (documents, projectId) => {
    if (!documents || documents.length === 0) return '';
    
    // Extract text from the first document
    const firstDoc = documents[0];
    console.log(`Document structure for ${projectId}:`, firstDoc);
    
    // Handle different document formats from API
    let contentToDisplay = '';
    
    if (firstDoc) {
      // Try different ways to extract content
      if (firstDoc.analysis_result) {
        // Direct analysis result in document object
        contentToDisplay = firstDoc.analysis_result;
      } else if (firstDoc.content) {
        // Direct content field
        contentToDisplay = firstDoc.content;
      } else if (firstDoc.text) {
        // Direct text field
        contentToDisplay = firstDoc.text;
      } else {
        // Object with key-value pairs (old format)
        const docKey = Object.keys(firstDoc)[0];
        const docContent = Object.values(firstDoc)[0];
        
        console.log(`Processing doc ${docKey}:`, docContent);
        
        // Check if we have fetched content for this document
        const cacheKey = `${projectId}_${docKey}`;
        const fetchedContent = documentContents[cacheKey];
        
        if (fetchedContent) {
          contentToDisplay = fetchedContent;
        } else if (typeof docContent === 'string') {
          if (docContent.startsWith('http') || docContent.startsWith('s3://')) {
            return 'Loading document content...';
          } else {
            contentToDisplay = docContent;
          }
        } else if (docContent && typeof docContent === 'object') {
          if (docContent.content) {
            contentToDisplay = docContent.content;
          } else if (docContent.text) {
            contentToDisplay = docContent.text;
          } else if (docContent.analysis_result) {
            contentToDisplay = docContent.analysis_result;
          } else {
            contentToDisplay = JSON.stringify(docContent);
          }
        }
      }
    }
    
    return contentToDisplay ? cleanDocumentContent(contentToDisplay) : 'Crisis analysis document available';
  };

  // Helper function to clean document content
  const cleanDocumentContent = (content) => {
    if (!content || typeof content !== 'string') return 'Document content available';
    
    let cleanContent = content
      .replace(/^#+\s+/gm, '') // Remove # headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with single space
      .replace(/\n/g, ' ') // Replace remaining newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return cleanContent;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: { 
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const SkeletonCard = () => (
    <motion.div className="skeleton-card" variants={cardVariants}>
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div 
        className="dashboard"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="dashboard-header" variants={itemVariants}>
          <h1 className="dashboard-title">Crisis Journalist AI</h1>
          <p className="dashboard-subtitle">
            AI-powered news analysis and reporting for crisis situations worldwide
          </p>
        </motion.div>

        <div className="recent-news-section">
          <motion.h2 className="section-title" variants={itemVariants}>
            Recent News
          </motion.h2>
          
          <motion.div variants={itemVariants}>
            <ParticleWave height={150} />
          </motion.div>

          <motion.div 
            className="news-grid"
            variants={containerVariants}
          >
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="dashboard-header" variants={itemVariants}>
        <h1 className="dashboard-title">Crisis Journalist AI</h1>
        <p className="dashboard-subtitle">
          AI-powered news analysis and reporting for crisis situations worldwide
        </p>
      </motion.div>

      <div className="recent-news-section">
        <motion.h2 className="section-title" variants={itemVariants}>
          Recent News
          <motion.span 
            style={{ marginLeft: '1rem', opacity: 0.7 }}
            variants={itemVariants}
          >
            <TrendingUp size={28} />
          </motion.span>
        </motion.h2>
        
        <motion.div variants={itemVariants}>
          <ParticleWave height={150} />
        </motion.div>

        {error && (
          <motion.div className="error" variants={itemVariants}>
            {error}
          </motion.div>
        )}

        <motion.div 
          className="news-grid"
          variants={containerVariants}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.project_id}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              <Link
                to={`/news/${userId}/${project.project_id}`}
                className="news-card"
              >
                <motion.div 
                  className="news-image"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.images && project.images.length > 0 ? (() => {
                    const imageUrl = project.images[0].presigned_url || 
                                   project.images[0].s3_url || 
                                   Object.values(project.images[0])[0] || 
                                   '/placeholder-image.jpg';
                    console.log(`Dashboard image URL for ${project.project_id}:`, imageUrl);
                    return (
                      <img 
                        src={imageUrl}
                        alt={project.title || project.project_id}
                        onError={(e) => {
                          console.log(`Image failed to load: ${imageUrl}`);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    );
                  })() : null}
                  <div style={{ display: project.images && project.images.length > 0 ? 'none' : 'flex' }}>
                    {project.metadata?.image_count > 0 ? (
                      <span>📸 {project.metadata.image_count} images</span>
                    ) : (
                      <span>📄 No images</span>
                    )}
                  </div>
                </motion.div>
                
                <div className="news-content">
                  <div className="news-header">
                    <h3 className="news-title">{project.title || project.project_id}</h3>
                    <motion.div 
                      className="news-location"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MapPin size={14} />
                      {getLocationFromTitle(project.title || project.project_id, project.context)}
                    </motion.div>
                  </div>
                  
                  <p className="news-description">
                    {project.metadata?.has_documents && project.documents && project.documents.length > 0
                      ? truncateText(getDocumentPreview(project.documents, project.project_id))
                      : project.context 
                        ? truncateText(project.context)
                        : `Crisis analysis for ${project.title || project.project_id} with ${project.metadata?.image_count || 0} images analyzed`
                    }
                  </p>
                  
                  <div className="news-footer">
                    <div className="news-meta">
                      <span className="news-date">
                        <Calendar size={14} />
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                    
                    <motion.span 
                      className="learn-more"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      View Details →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && !loading && (
          <motion.div 
            style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              color: 'rgba(26, 32, 44, 0.8)',
              background: 'rgba(240, 245, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(30, 58, 138, 0.2)'
            }}
            variants={itemVariants}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                No news articles found. Create your first analysis!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/create-news" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(30, 58, 138, 0.5)',
                    display: 'inline-block'
                  }}
                >
                  Create News →
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;