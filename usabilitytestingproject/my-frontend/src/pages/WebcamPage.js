import Webcam from 'react-webcam';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WebcamPage(){
    const [showWebcam, setShowWebcam] = useState(false); 
    const [emotion, setEmotion] = useState(''); 
    const [landmarks, setLandmarks] = useState([]);
    const [emotionHistory, setEmotionHistory] = useState([]); // Track history of emotions
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const emotionList = ["happy", "sad", "angry", "surprise", "neutral", "disgust", "fear"];
    const emotionColors = {
        happy: "yellow",
        sad: "blue",
        angry: "red",
        surprise: "orange",
        neutral: "purple",
        disgust: "green",
        fear: "white",
    };

    const handleStartWebcam = () => {
        setShowWebcam(true); 
        setEmotionHistory([]); // Reset history when starting webcam
    };

    const handleStopWebcam = () => {
        setShowWebcam(false); 
    };


    const drawLandmarks = (landmarks, emotion, boundingBox, connections) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = webcamRef.current.video;
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        if (boundingBox) {
            const expansionFactor = 0.1; // Adjust this value to control how much the box is expanded
            const adjustedX = boundingBox.x - boundingBox.width * expansionFactor;
            const adjustedY = boundingBox.y - boundingBox.height * expansionFactor;
            const adjustedWidth = boundingBox.width * (1 + 2 * expansionFactor);
            const adjustedHeight = boundingBox.height * (1 + 2 * expansionFactor);

            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                adjustedX,
                adjustedY,
                adjustedWidth,
                adjustedHeight
            );

            // Display detected emotion on the bounding box border (near the top of the box)
            if (emotion) {
                ctx.font = '20px Arial';
                ctx.fillStyle = 'green';
                ctx.textAlign = 'center';
                // Adjust the position to place the text just above the bounding box
                ctx.fillText(emotion, adjustedX + adjustedWidth / 2, adjustedY - 10);
            }
        }
        
            // Draw connections (lines)
        if (connections && landmarks.length > 0) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            connections.forEach(({ start, end }) => {
                const startPoint = landmarks[start];
                const endPoint = landmarks[end];
                if (startPoint && endPoint) {
                    ctx.beginPath();
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(endPoint.x, endPoint.y);
                    ctx.stroke();
                }
            });
        }

        // Draw landmarks (dots)
        if (landmarks.length > 0) {
            ctx.fillStyle = 'yellow';
            landmarks.forEach(({ x, y }) => {
                ctx.beginPath();
                ctx.arc(x, y, 0.5, 0, 2 * Math.PI); // Circle for each landmark
                ctx.fill();
            });
        }
    };
    
    

    const captureAndSendFrame = async () => {
        const imageSrc = webcamRef.current.getScreenshot(); 
        if (imageSrc) {
          try {
            const response = await axios.post('http://127.0.0.1:8000/emotion-detection/', {
              image: imageSrc
            }, {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  
              }
            });
            const detectedEmotion = response.data.emotion;
            const receivedLandmarks = response.data.landmarks;
            const boundingBox = response.data.bounding_box;
            const connections = response.data.connections;


            setEmotion(response.data.emotion); 
            setLandmarks(response.data.landmarks);
            // drawLandmarks(response.data.landmarks, response.data.emotion);
            drawLandmarks(receivedLandmarks, detectedEmotion, boundingBox, connections); // Render landmarks, bounding box, and emotion
           // Add binary data for all emotions
           const newEntry = emotionList.reduce((acc, em) => {
            acc[em] = em === detectedEmotion ? 1 : 0;
            return acc;
        }, { time: new Date().toLocaleTimeString() });

        setEmotionHistory((prev) => [...prev, newEntry]);
          } catch (error) {
            console.error('Error capturing frame:', error);
          }
        }
    };

    useEffect(() => {
        let interval;
        if (showWebcam) {
            interval = setInterval(captureAndSendFrame, 1000); 
        }
        return () => clearInterval(interval); 
    }, [showWebcam]);

    // Prepare data for the chart
    const chartData = {
        labels: emotionHistory.map((data) => data.time), // X-axis: Timestamps
        datasets: emotionList.map((emotion) => ({
            label: emotion,
            data: emotionHistory.map((entry) => entry[emotion] || 0),
            borderColor: emotionColors[emotion],
            backgroundColor: `${emotionColors[emotion]}33`, // Transparent version
            tension: 0.4,
            fill: false,
        })),
    };
    
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    stepSize: 1, // Ensure only 0 and 1 appear on Y-axis
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const emotion = tooltipItem.dataset.label;
                        const value = tooltipItem.raw === 1 ? "Detected" : "Not Detected";
                        return `${emotion}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div style={styles.pretty} > 
            <h2 style={styles.header}>Webcam Control</h2>
            <div style={styles.webcamButtonContainer}>
                <button
                    style={styles.startButton}
                    onClick={handleStartWebcam} 
                    disabled={showWebcam} 
                >
                    Start Webcam
                </button>
                <button
                    style={styles.stopButton}
                    onClick={handleStopWebcam} 
                    disabled={!showWebcam} 
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
            {/* {emotion && <h3>Detected Emotion: {emotion}</h3>} */}
            {!showWebcam && emotionHistory.length > 0 && (
            <div style={{ marginTop: "20px" }}>
                <h3>Emotion History Chart</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        )}
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
