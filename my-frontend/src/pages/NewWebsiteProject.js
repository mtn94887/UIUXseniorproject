// src/pages/WebsiteProj.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function WebsiteProj() {
  const [sampleSize, setSampleSize] = useState(0);

  // Handle increase and decrease for sample size
  const increaseSampleSize = () => setSampleSize(sampleSize + 1);
  const decreaseSampleSize = () => setSampleSize(sampleSize > 0 ? sampleSize - 1 : 0);

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
                onClick={decreaseSampleSize}
                style={styles.sampleButton}
              >
                -
              </button>
              <span style={styles.sampleCount}>{sampleSize}</span>
              <button
                onClick={increaseSampleSize}
                style={styles.sampleButton}
              >
                +
              </button>
            </label>
          </div>
        </div>

        {/* Proceed Button */}
        <Link to="/project-main-page">
          <button style={styles.proceedButton}>Proceed</button>
        </Link>
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