import React, { useState } from 'react';
import axios from 'axios';

const UploadNDisplayBioData = () => {
  const [file, setFile] = useState(null); // State to handle file input
  const [uploadedFilePath, setUploadedFilePath] = useState(''); // Path to display uploaded image
  const [error, setError] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
    setUploadedFilePath(''); // Reset the displayed file path
    setError(''); // Reset error message
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Adjust the key name to match backend expectations

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload-photo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedFilePath(response.data.file_path); // Assume backend returns the file path
      setError('');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload the file. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload and Display Photo</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Select Photo:
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />
        </label>
        <button type="submit" style={styles.uploadButton}>
          Upload
        </button>
      </form>

      {uploadedFilePath && (
        <div style={styles.imageContainer}>
          <h3>Uploaded Photo:</h3>
          <img src={`${uploadedFilePath}`} alt="Uploaded" style={styles.image} />
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
  imageContainer: {
    marginTop: '20px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
    border: '2px solid #61dafb',
    borderRadius: '5px',
  },
  errorMessage: {
    marginTop: '20px',
    color: 'red',
  },
};

export default UploadNDisplayBioData;
