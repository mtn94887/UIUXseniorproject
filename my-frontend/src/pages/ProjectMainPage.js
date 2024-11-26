// src/pages/ProjPage.js
import React from 'react';

function ProjPage() {
  return (
    <div style={styles.pageContainer}>
      <button style={styles.startButton}>Start</button>
      <button style={styles.settingsButton}>Settings</button>
      <p style={styles.noResultsText}>No results to display for now.</p>
    </div>
  );
}

// Inline styles for the ProjPage component
const styles = {
  pageContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#282c34',  // Same background color as other pages
    color: '#61dafb',  // Text color to match the theme
    position: 'relative',  // Needed for absolute positioning of the "Start" and "Settings" buttons
  },
  noResultsText: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '50px',  // Ensure text doesn't overlap with the buttons
  },
  startButton: {
    position: 'absolute',  // Position the button relative to the page container
    top: '30px',  // Distance from the top of the container
    left: '750px',  // Move the button to the left
    backgroundColor: '#61dafb',  // Button background color
    color: '#282c34',  // Button text color
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '120px',
  },
  settingsButton: {
    position: 'absolute',  // Position the "Settings" button below the "Start" button
    top: '80px',  // Adjust this value to place it below the "Start" button
    left: '750px',  // Align it to the left same as the "Start" button
    backgroundColor: '#61dafb',  // Button background color
    color: '#282c34',  // Button text color
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '120px',
  },
};

export default ProjPage;