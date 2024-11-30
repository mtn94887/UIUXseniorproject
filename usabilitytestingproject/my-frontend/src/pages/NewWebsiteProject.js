import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


function WebsiteProj() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    description: '',
    sample_size: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/create-project/', {
        project_name: formData.project_name,
        website_url: formData.website_url,
        description: formData.description,
        sample_size: formData.sample_size,
      });
      alert('Project created successfully!');
      setFormData({ project_name: '', website_url: '', description: '', sample_size: 0 });
      navigate('/project-list'); // Navigate to the next page
    } catch (error) {
      console.error('Error creating project:', error.response.data);
    }
  };
  

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Website Project</h1>

        {/* Website URL Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Project Name:
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Enter Project Name"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Website URL Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Website URL:
              <input
                type="text"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="Enter Website URL"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Description Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Description:
              <textarea
                 name="description"
                 value={formData.description}
                 onChange={handleInputChange}
                 placeholder="Enter Description"
                 style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Sample Size Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Sample Size:
              <button
                onClick={() => setFormData({ ...formData, sample_size: Math.max(formData.sample_size - 1, 0) })}
                style={styles.sampleButton}
              >
                -
              </button>
              <span style={styles.sampleCount}>{formData.sample_size}</span>
              <button
                onClick={() => setFormData({ ...formData, sample_size: formData.sample_size + 1 })}
                style={styles.sampleButton}
              >
                +
              </button>
            </label>
          </div>
        </div>

        {/* Proceed Button */}
          <button onClick={handleSubmit} style={styles.proceedButton}>Submit</button>        
        
      </header>
    </div>
  );
}

// Inline styles for the WebsiteProj component
const styles = {
  app: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
  },
  header: {
    textAlign: 'center',
    color: '#61dafb',
    fontFamily: 'Arial, sans-serif',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  boxItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 10px',
  },
  boxLabel: {
    fontSize: '1em',
    color: '#61dafb',
    marginBottom: '10px',
  },
  inputField: {
    padding: '8px',
    width: '300px',
    fontSize: '1em',
    marginTop: '5px',
    borderRadius: '4px',
    border: '2px solid #61dafb',
    backgroundColor: '#282c34',
    color: 'white',
  },
  sampleButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '1.2em',
    margin: '0 10px',
    borderRadius: '4px',
  },
  sampleCount: {
    fontSize: '1.2em',
    padding: '8px',
    fontWeight: 'bold',
    color: '#61dafb',
  },
  proceedButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '12px 24px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default WebsiteProj;


