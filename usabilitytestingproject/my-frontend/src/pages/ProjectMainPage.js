import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function ProjPage() {
  const { id } = useParams(); 
  const [project, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from the API
    axios.get(`http://127.0.0.1:8000/list-projects/${id}/`)
      .then((response) => {
        console.log(response.data); // Log response
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, [id]);

return (
  <div style={styles.pageContainer}>
      {/* Left Column: Project Details */}
      <div style={styles.leftColumn}>
        <h1 style={styles.header}>Project Details</h1>
        {/* <div style={styles.projectList}>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} style={styles.projectCard}>
                <h2 style={styles.projectName}>{project.project_name}</h2>
                <p style={styles.projectDetail}>
                  <strong>Website URL:</strong> {project.website_url}
                </p>
                <p style={styles.projectDetail}>
                  <strong>Description:</strong> {project.description}
                </p>
                <p style={styles.projectDetail}>
                  <strong>Sample Size:</strong> {project.sample_size}
                </p>
              </div>
            ))
          ) : (
            <p style={styles.noResultsText}>No projects available.</p>
          )}
        </div> */}
        <div style={styles.projectCard}>
          <h2 style={styles.projectName}>{project.project_name}</h2>
          <p style={styles.projectDetail}>
            <strong>Website URL:</strong> <a href={project.website_url}>{project.website_url}</a>
          </p>
          <p style={styles.projectDetail}>
            <strong>Description:</strong> {project.description}
          </p>
          <p style={styles.projectDetail}>
            <strong>Sample Size:</strong> {project.sample_size}
          </p>
        </div>
        <h1></h1>
        <h1></h1>
        <div style={styles.buttonContainer}>
          <button style={styles.startButton}>Start</button>
          <button style={styles.settingsButton}>Settings</button>
        </div>
      </div>

      {/* Right Column: Buttons and Message */}
      <div style={styles.rightColumn}>
        <p style={styles.noDataText}>No data yet.</p>
      </div>
    </div>
  );
    
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#282c34',
    color: '#61dafb',
    minHeight: '100vh',
  },
  leftColumn: {
    flex: 1,
    padding: '20px',
    marginRight: '20px',
    borderRight: '1px solid #61dafb',
  },
  rightColumn: {
    flex: 6,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  projectCard: {
    backgroundColor: '#20232a',
    color: '#61dafb',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  projectName: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  projectDetail: {
    fontSize: '1em',
    marginBottom: '8px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '80%',
  },
  settingsButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '80%',
  },
  noDataText: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '20px',
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: '1em',
    fontWeight: 'normal',
    textAlign: 'center',
  },
};
export default ProjPage;
