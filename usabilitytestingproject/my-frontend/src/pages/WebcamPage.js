import Webcam from 'react-webcam';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // For sending HTTP requests to the backend

function WebcamPage(){
    const [showWebcam, setShowWebcam] = useState(false); // State to control webcam visibility
    const [emotion, setEmotion] = useState(''); // State to store detected emotion
    const [landmarks, setLandmarks] = useState([]);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Function to handle the Start button click
    const handleStartWebcam = () => {
        setShowWebcam(true); // Show the webcam
    };

    // Function to handle the Stop button click
    const handleStopWebcam = () => {
        setShowWebcam(false); // Hide the webcam
    };

    const drawLandmarks = (landmarks) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = webcamRef.current.video;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        landmarks.forEach(({ bbox, keypoints }) => {
            // Draw bounding box
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);

            // Draw keypoints
            ctx.fillStyle = 'red';
            keypoints.forEach(({ x, y }) => {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
    };

    const captureAndSendFrame = async () => {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture frame
        if (imageSrc) {
          try {
            const response = await axios.post('http://127.0.0.1:8000/emotion-detection/', {
              image: imageSrc
            }, {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  // Include CSRF token in the request header
              }
            });
            setEmotion(response.data.emotion); // Set the detected emotion
            setLandmarks(response.data.landmarks);
            drawLandmarks(response.data.landmarks);
          } catch (error) {
            console.error('Error capturing frame:', error);
          }
        }
      };

    // Capture frame every second (or adjust as needed for real-time feedback)
    useEffect(() => {
        let interval;
        if (showWebcam) {
            interval = setInterval(captureAndSendFrame, 1000); // Send frame every 1 second
        }
        return () => clearInterval(interval); // Cleanup the interval when webcam is stopped
    }, [showWebcam]);

    return (
        <div style={styles.pretty} > 
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
                <div style={{ position: 'relative' }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: 'user' }}
                    style={{ width: '90%', borderRadius: '8px', marginTop: '20px' }}
                />
                <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                        }}
                    />
                </div>

            )}
            {emotion && <h3>Detected Emotion: {emotion}</h3>}
        </div>
    );
}

const styles = {
    pretty:{
        color:'#282c34',
    },
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

export default WebcamPage;
