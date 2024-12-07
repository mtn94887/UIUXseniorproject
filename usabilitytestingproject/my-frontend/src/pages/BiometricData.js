import React from 'react';
import { useParams } from 'react-router-dom';

const BiometricData = () => {
  const { taskId } = useParams(); // Get the task ID from the route
  const handleCameraOpen = () => {
    window.open(`/webcam-page`, '_blank'); // Open the website in a new tab
  };

  return (
    <div>
        <h1>Biometric Data for Task ID: {taskId}</h1>
        <button 
            style={styles.startButton}
            onClick={handleCameraOpen}
        >
            open camera 
        </button>
    </div>
  );
};


const styles = {
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
}

export default BiometricData;
