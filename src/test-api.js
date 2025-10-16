// Test script to verify API endpoints
import { newsAPI } from './services/api.js';

const testAPI = async () => {
  try {
    console.log('Testing getUserProjects for user 101...');
    const projects = await newsAPI.getUserProjects('101');
    console.log('Projects:', projects);
    
    // If projects exist, test getting details for the first one
    if (projects && projects.length > 0) {
      const firstProject = projects[0];
      console.log('Testing getProjectDetails for first project...');
      const details = await newsAPI.getProjectDetails('101', firstProject.id);
      console.log('Project details:', details);
    }
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
};

// Run test
testAPI();