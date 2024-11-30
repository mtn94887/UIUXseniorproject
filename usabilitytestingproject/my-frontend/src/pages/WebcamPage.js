import Webcam from 'react-webcam';
import React, { useState, useRef } from 'react';


function WebcamPage(){
    const [showWebcam, setShowWebcam] = useState(false); // State to control webcam visibility
    const webcamRef = useRef(null);

     // Function to handle the Start button click
    const handleStartWebcam = () => {
        setShowWebcam(true); // Show the webcam
    };

    // Function to handle the Stop button click
    const handleStopWebcam = () => {
        setShowWebcam(false); // Hide the webcam
    };

    return(
        <div> 
            <h2 style={styles.header}>Webcam Control</h2>
            <div style={styles.webcamButtonContainer}>
                <button
                    style={styles.startButton}
                    onClick={handleStartWebcam} // Start webcam
                    disabled={showWebcam} // Disable when webcam is active
                >
                    Start Webcam
                </button>
                <button
                    style={styles.stopButton}
                    onClick={handleStopWebcam} // Stop webcam
                    disabled={!showWebcam} // Disable when webcam is inactive
                >
                    Stop Webcam
                </button>
            </div>
            {showWebcam && (
            <Webcam
                audio={false}
                ref={webcamRef}
                style={{ width: '90%', borderRadius: '8px', marginTop: '20px' }}
            />
            )}
        </div>
    )
}

const styles = {
    header: {
        fontSize: '2em',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    webcamButtonContainer: {
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
    stopButton: {
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

export default WebcamPage