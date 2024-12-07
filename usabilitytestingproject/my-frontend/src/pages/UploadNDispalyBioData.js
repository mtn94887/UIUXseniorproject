import React, { useState } from 'react';
import axios from 'axios';

const UploadNDisplayBioData = () => {
  const [file, setFile] = useState(null); // State to handle file input
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
    setUploadSuccess(false); // Reset success message
    setError(''); // Reset error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('biometric_data', file);

    try {
      await axios.post('http://127.0.0.1:8000/upload-bio-data/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadSuccess(true);
      setError('');
    } catch (err) {
      console.error('Error uploading biometric data:', err);
      setError('Failed to upload the biometric data. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload and Display Biometric Data</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Select Biometric Data File:
          <input type="file" onChange={handleFileChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.uploadButton}>
          Upload
        </button>
      </form>

      {uploadSuccess && (
        <div style={styles.successMessage}>
          Biometric data uploaded successfully!
        </div>
      )}
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

// Styles
const styles = {
  container: {
    color: 'white',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#61dafb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginBottom: '10px',
  },
  input: {
    marginTop: '10px',
    padding: '5px',
  },
  uploadButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#61dafb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMessage: {
    marginTop: '20px',
    color: 'green',
  },
  errorMessage: {
    marginTop: '20px',
    color: 'red',
  },
};

export default UploadNDisplayBioData;
