import { LuCamera, LuCameraOff } from "react-icons/lu";
import Webcam from 'react-webcam';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WebcamCapture() {

    // Camera related function
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isHovered, setHovered] = useState(false);
    const toggleCamera = () => {
        setShowWebcam(prevState => !prevState);
    };

    // Webcam choice related function
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

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

    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    // Emotion related state
    const [emotion, setEmotion] = useState('');
    const [emotionHistory, setEmotionHistory] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [boundingBox, setBoundingBox] = useState(null);
    const [connections, setConnections] = useState([]);
    const [emotionProbabilities, setEmotionProbabilities] = useState({});
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const drawLandmarks = (landmarks, emotion, boundingBox, connections, emotionProbabilities) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = webcamRef.current.video;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (boundingBox) {
            const expansionFactor = 0.1;
            const adjustedX = boundingBox.x - boundingBox.width * expansionFactor;
            const adjustedY = boundingBox.y - boundingBox.height * expansionFactor;
            const adjustedWidth = boundingBox.width * (1 + 2 * expansionFactor);
            const adjustedHeight = boundingBox.height * (1 + 2 * expansionFactor);

            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);

            if (emotion) {
                ctx.font = '20px Arial';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText(emotion, adjustedX + adjustedWidth / 2, adjustedY - 10);
            }
        }

        if (emotionProbabilities) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'left';
            let yOffset = 20;

            for (const [emotion, probability] of Object.entries(emotionProbabilities)) {
                const percentage = (probability).toFixed(2);
                ctx.fillText(`${emotion}: ${percentage}%`, 10, yOffset);
                yOffset += 20;
            }
        }

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

        if (landmarks.length > 0) {
            ctx.fillStyle = 'blue';
            landmarks.forEach(({ x, y }) => {
                ctx.beginPath();
                ctx.arc(x, y, 0.9, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    };

    const captureAndSendFrame = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/emotion-detection-light/', {
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

                setEmotion(detectedEmotion);
                setLandmarks(receivedLandmarks);
                setBoundingBox(boundingBox);
                setConnections(connections);
                setEmotionProbabilities(emotionProbabilities);

                drawLandmarks(receivedLandmarks, detectedEmotion, boundingBox, connections, emotionProbabilities);

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
            interval = setInterval(captureAndSendFrame, 1000); // Capture and send frame every second
        }
        return () => clearInterval(interval); // Clean up on component unmount
    }, [showWebcam]);

    return (
        <div style={styles.row}>
            <h3>Facial Expression Recognition</h3>
            <div style={styles.container}>
                <div style={styles.column}>
                    <div style={styles.box1}>
                        {showWebcam && selectedDeviceId ? (
                            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width="100%"
                                    height="100%"
                                    videoConstraints={{
                                        width: "100%",
                                        height: "100%",
                                        facingMode: "user",
                                        deviceId: selectedDeviceId,
                                    }}
                                    style={{
                                        display: "block",
                                        borderRadius: "8px",
                                    }}
                                />
                                <canvas
                                    ref={canvasRef}
                                    width="100%"
                                    height="100%"
                                    style={{
                                        position: "absolute",
                                        top: '28px',
                                        left: 0,
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px'
                                }}
                            >
                                <LuCameraOff size={60} color="gray" />
                                <h1>Please turn on the camera.</h1>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
                        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Select a Webcam:</label>
                            <select
                                onChange={handleDeviceChange}
                                value={selectedDeviceId}
                                style={{
                                    padding: '8px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#fff',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: '0.3s',
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                {devices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${devices.indexOf(device) + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            style={{
                                ...styles.camerabutton,
                                ...(isHovered ? styles.camerabuttonHover : {})
                            }}
                            onClick={toggleCamera}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            {showWebcam ? <LuCameraOff size={30} color="white" /> : <LuCamera size={30} color="white" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
    },
    column: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    box1: {
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: '8px',
        backgroundColor: '#F5F5F5',
    },
    camerabutton: {
        border: 'none',
        backgroundColor: '#407BFF',
        padding: '12px 16px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        color: '#fff',
    },
    camerabuttonHover: {
        backgroundColor: '#3067D0',
    }
};

export default WebcamCapture;
