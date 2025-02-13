import Webcam from 'react-webcam';
import { CameraOff } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TempWebcam(){
    const [showWebcam, setShowWebcam] = useState(false); 
    const [webcamSize, setWebcamSize] = useState({ width: 0, height: 0 });
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
        fear: "gray",
    };
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    // Enumerate devices and filter for video inputs
    useEffect(() => {
        const getDevices = async () => {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
            }
        };
        getDevices();
    }, []);

    // Handle webcam selection
    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    // Start the camera 
    const handleStartWebcam = () => {
        console.log("Start Webcam Clicked, showWebcam:", showWebcam);
        setShowWebcam(true); 
        setEmotionHistory([]);
    };

    // Close the camera 
    const handleStopWebcam = () => {
        console.log("Stop Webcam Clicked, showWebcam:", showWebcam);
        setShowWebcam(false); 
    };

    // drawing facial landmarks on camera 
    const drawLandmarks = (landmarks, emotion, boundingBox, connections, emotionProbabilities) => {
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
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                // Adjust the position to place the text just above the bounding box
                ctx.fillText(emotion, adjustedX + adjustedWidth / 2, adjustedY - 10);
            }
        }

        // Display all emotion percentages in the top-left corner
        if (emotionProbabilities) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            let yOffset = 20; // Start position for emotion list

            for (const [emotion, probability] of Object.entries(emotionProbabilities)) {
                const percentage = (probability).toFixed(2); // Convert to percentage
                ctx.fillText(`${emotion}: ${percentage}%`, 10, yOffset);
                yOffset += 20; // Increment y position for next emotion
            }
        }

        // Draw connections (lines)
        if (connections && landmarks.length > 0) {
            ctx.strokeStyle = 'red';
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
            ctx.fillStyle = 'blue';
            landmarks.forEach(({ x, y }) => {
                ctx.beginPath();
                ctx.arc(x, y, 0.9, 0, 2 * Math.PI); // Circle for each landmark
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
                const emotionProbabilities = response.data.emotion_probabilities;


                setEmotion(response.data.emotion); 
                setLandmarks(response.data.landmarks);
                // drawLandmarks(response.data.landmarks, response.data.emotion);
                drawLandmarks(receivedLandmarks, detectedEmotion, boundingBox, connections, emotionProbabilities); // Render landmarks, bounding box, and emotion
        
                const newEntry = {
                    time: new Date().toLocaleTimeString(),
                    ...Object.fromEntries(
                        Object.entries(emotionProbabilities).map(([key, value]) => [key, value])
                    ),
                };

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
            data: emotionHistory.map((entry) => (entry[emotion] || 0)),
            borderColor: emotionColors[emotion],
            backgroundColor: `${emotionColors[emotion]}33`, // Transparent version
            tension: 0.4,
            fill: false,
        })),
    };
    
    //Chart Option
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 100, // Set Y-axis range to 0% to 100%
                ticks: {
                    stepSize: 25, 
                    callback: (value) => `${value}%`, // Add percentage symbol to ticks
                    color: 'black',
                },
                grid: {
                    color: 'gray', // Gridline color
                },
            },
            x: {
                ticks: {
                    color: 'black', // X-axis labels color
                },
                grid: {
                    color: 'gray', // X-axis gridlines
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const emotion = tooltipItem.dataset.label;
                        // const value = tooltipItem.raw === 1 ? "Detected" : "Not Detected";
                        const value = tooltipItem.raw.toFixed(2); // Format value to two decimals
                        return `${emotion}: ${value}`;
                    },
                },
            },
            legend: {
                labels: {
                    boxWidth: 10, // Adjust to make legend squares smaller
                    boxHeight: 10, // Ensure a square shape
                    usePointStyle: false, // Ensure square instead of circles
                },
            },

        },
    };

    return (
        <div style={styles.pretty} > 

            {/* title */}
            <h2 style={styles.header}>Facial Expression Recognition</h2>

            {/* webcam selection */}
            <div>
                <label htmlFor="device-select" style={{color:'white', alignItems: 'center'}}>Select Camera:</label>
                <select
                    id="device-select"
                    onChange={handleDeviceChange}
                    value={selectedDeviceId || ''}
                >
                    {devices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId}`}
                        </option>
                    ))}
                </select>
            </div>

            <h></h>

            {/* start and stop camera button  */}
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


            {/* {showWebcam &&  selectedDeviceId && (
                <div style={{ position: 'relative' }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: 'user', deviceId: selectedDeviceId}}
                    style={{ 
                        display: 'block', // Prevent video scaling issues
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px'
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        // width: '100%',
                        // height: '100%',
                        pointerEvents: 'none',
                    }}
                    />
                </div>
            )} */}

            {/* {selectedDeviceId && (
                <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '8px' }}>
                    {showWebcam ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                videoConstraints={{ facingMode: 'user', deviceId: selectedDeviceId }}
                                style={{ display: 'block', width: '100%', height: '100%', borderRadius: '8px' }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    pointerEvents: 'none',
                                }}
                            />
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            
                            <CameraOff size={50} color="gray" />
                            <p style={{ color: 'gray', fontSize: '1.2em', marginTop: '10px' }}>Camera Off</p>
                        </div>
                    )}
                </div>
            )} */}

{selectedDeviceId && (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '8px' }}>
        {showWebcam ? (
            <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ facingMode: 'user', deviceId: selectedDeviceId }}
                    style={{ display: 'block', width: '100%', height: '100%', borderRadius: '8px' }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',  // Ensures canvas matches the webcam width
                        height: '100%', // Ensures canvas matches the webcam height
                        pointerEvents: 'none',
                        borderRadius: '8px', // Optional for the same rounded border
                    }}
                />
            </>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <CameraOff size={50} color="gray" />
                <p style={{ color: 'gray', fontSize: '1.2em', marginTop: '10px' }}>Camera Off</p>
            </div>
        )}
    </div>
)}



            {/* {emotion && <h3>Detected Emotion: {emotion}</h3>} */}

            {!showWebcam && emotionHistory.length > 0 && (
                <div style={{ 
                    marginTop: "20px",
                    backgroundColor: "white",
                    padding: "20px", // Increased padding for extra space
                    borderRadius: "8px",
                    border: "1px solid #ccc", // Optional border for clarity
                    width: "1400px", // Adjust width if needed
                    height: "1000px", // Set a fixed height for better Y-axis visibility
                }}>
                    <h3>Emotion History Chart</h3>
                    <Line data={chartData} options={chartOptions} style={{ width: "100%", height: "500px" }} />
                    
                </div>
            )}
        </div>
    );
}


//CSS code
const styles = {
    pretty:{
        color:'#282c34',
    },
    header: {
        fontSize: '2em',
        fontWeight: 'bold',
        color: 'black', 
        marginBottom: '20px',
        alignItems: 'center', 
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

export default TempWebcam;
