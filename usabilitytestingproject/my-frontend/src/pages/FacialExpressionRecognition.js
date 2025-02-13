import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 

//camera related import 
import { LuCamera,LuCameraOff } from "react-icons/lu";
import Webcam from 'react-webcam';

//line chart related imports 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



function FacialExpressionRecognition(){

    //camera related function 
    const [showWebcam, setShowWebcam] = useState(false); 
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isHovered, setHovered] = useState(false);
    const toggleCamera = () => {
        // if (showWebcam) {
        //     // If camera is being turned off, trigger CSV download
        //     handleDownloadCSV();
        // }
        setShowWebcam(prevState => !prevState);
    };

    //webcam choice related function 
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

    // emotion chart related function 
    const [emotion, setEmotion] = useState(''); 
    const [emotionHistory, setEmotionHistory] = useState([]); 
    const emotionList = ["happy", "sad", "angry", "surprise", "neutral", "disgust", "fear"];
    const emotionColors = {
        happy: "yellow",
        sad: "blue",
        angry: "red",
        surprise: "orange",
        neutral: "gray",
        disgust: "green",
        fear: "purple",
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    //facial landmark related function 
    const [landmarks, setLandmarks] = useState([]);
    // const drawLandmarks = (landmarks, emotion, boundingBox, connections, emotionProbabilities) => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');
    //     const video = webcamRef.current.video;
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
    
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //     if (boundingBox) {
    //         const expansionFactor = 0.1; // Adjust this value to control how much the box is expanded
    //         const adjustedX = boundingBox.x - boundingBox.width * expansionFactor;
    //         const adjustedY = boundingBox.y - boundingBox.height * expansionFactor;
    //         const adjustedWidth = boundingBox.width * (1 + 2 * expansionFactor);
    //         const adjustedHeight = boundingBox.height * (1 + 2 * expansionFactor);
    //         ctx.strokeStyle = 'green';
    //         ctx.lineWidth = 2;
    //         ctx.strokeRect(
    //             // adjustedX,
    //             // adjustedY,
    //             // adjustedWidth,
    //             // adjustedHeight
    //             adjustedX * (canvas.width / video.videoWidth), // Scale position based on video dimensions
    //             adjustedY * (canvas.height / video.videoHeight), // Scale position based on video dimensions
    //             adjustedWidth * (canvas.width / video.videoWidth), // Scale size based on video dimensions
    //             adjustedHeight * (canvas.height / video.videoHeight) // Scale size based on video dimensions
    //         );
    //         // Display detected emotion on the bounding box border (near the top of the box)
    //         if (emotion) {
    //             ctx.font = '20px Arial';
    //             ctx.fillStyle = 'red';
    //             ctx.textAlign = 'center';
    //             // Adjust the position to place the text just above the bounding box
    //             ctx.fillText(emotion, adjustedX + adjustedWidth / 2, adjustedY - 10);
    //         }
    //     }
    //     // Display all emotion percentages in the top-left corner
    //     if (emotionProbabilities) {
    //         ctx.font = '16px Arial';
    //         ctx.fillStyle = 'red';
    //         ctx.textAlign = 'left';
    //         let yOffset = 20; // Start position for emotion list

    //         for (const [emotion, probability] of Object.entries(emotionProbabilities)) {
    //             const percentage = (probability).toFixed(2); // Convert to percentage
    //             ctx.fillText(`${emotion}: ${percentage}%`, 10, yOffset);
    //             yOffset += 20; // Increment y position for next emotion
    //         }
    //     }
    //     // Draw connections (lines)
    //     if (connections && landmarks.length > 0) {
    //         ctx.strokeStyle = 'red';
    //         ctx.lineWidth = 1;
    //         connections.forEach(({ start, end }) => {
    //             const startPoint = landmarks[start];
    //             const endPoint = landmarks[end];
    //             if (startPoint && endPoint) {
    //                 ctx.beginPath();
    //                 // ctx.moveTo(startPoint.x, startPoint.y);
    //                 // ctx.lineTo(endPoint.x, endPoint.y);
    //                 ctx.moveTo(startPoint.x * (canvas.width / video.videoWidth), startPoint.y * (canvas.height / video.videoHeight)); // Scale position
    //                 ctx.lineTo(endPoint.x * (canvas.width / video.videoWidth), endPoint.y * (canvas.height / video.videoHeight)); // Scale position
    //                 ctx.stroke();
    //             }
    //         });
    //     }
    //     // Draw landmarks (dots)
    //     if (landmarks.length > 0) {
    //         ctx.fillStyle = 'blue';
    //         landmarks.forEach(({ x, y }) => {
    //             ctx.beginPath();
    //             // ctx.arc(x, y, 0.9, 0, 2 * Math.PI); // Circle for each landmark
    //             ctx.arc(x * (canvas.width / video.videoWidth), y * (canvas.height / video.videoHeight), 0.9, 0, 2 * Math.PI); // Scale position
    //             ctx.fill();
    //         });
    //     }
    // };
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
    

    //screenshot taken related functions 
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
            //    // Add binary data for all emotions
            //     const newEntry = emotionList.reduce((acc, em) => {
            //         acc[em] = em === detectedEmotion ? 1 : 0;
            //         return acc;
            //     }, { time: new Date().toLocaleTimeString() });
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


    //line chart related functions 
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


    //csv file download related functions 
    const convertToCSV = (data) => {
        // Define CSV headers
        const headers = ["Time", ...emotionList];
        const rows = data.map(entry => {
            const time = entry.time;
            const percentages = emotionList.map(emotion => entry[emotion] || 0);
            return [time, ...percentages];
        });
    
        // Create CSV content
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");
    
        return csvContent;
    };
    const downloadCSV = (csvContent, filename = "emotion_data.csv") => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };
    const handleDownloadCSV = () => {
        const csvContent = convertToCSV(emotionHistory);
        downloadCSV(csvContent);
    };
    

    return (
        <div style={styles.row}>
            <h3>Facial Expression Recognition</h3>
            <div style={styles.container}>
                <div style={styles.column}>
                    <div style={styles.box1}>
                        {showWebcam && selectedDeviceId ? (
                            // <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            <div style={{ position: "relative",width: "100%", height: "100%"   }}>

                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width='100%'
                                    height= '100%'
                                    videoConstraints={{
                                        // width: '680px', // Adjust this based on the box1 width
                                        // height: '570px',  // Adjust this based on the box1 height
                                        width: "100%",
                                        height: "100%",
                                        facingMode: "user",
                                        deviceId: selectedDeviceId, 
                                    }}
                                    style={{
                                        display: "block",
                                        // width: "100%",
                                        // height: "100%",
                                        borderRadius: "8px",
                                        //objectFit: "cover",
                                    }}
                                />
                                <canvas
                                    ref={canvasRef}
                                    width = "100%"
                                    height = "100%"
                                    style={{
                                        position: "absolute",
                                        // top: 0,
                                        top: '28px',
                                        left: 0,
                                        // width: '680px', // Adjust this based on the box1 width
                                        // height: '570px',
                                        // width: "100%",  // Ensure canvas covers the same area as the video
                                        // height: "100%",
                                        pointerEvents: "none",
                                    }}
                                />
                            </div>
                            ) : (
                            // <FaRegTimesCircle size={30} color="gray" />
                            <div 
                                style={{ 
                                    display: 'flex', // Makes it a flex container
                                    flexDirection: 'column', // Stacks items vertically
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    borderRadius: '8px'
                                }}
                            >
                                <LuCameraOff size={60} color="gray" />
                                <h1></h1>
                                <p>Please turn on the camera.</p>
                            </div>
                        )}
                    </div>


                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px' ,justifyContent: 'space-between',}}>
                        {/* Webcam Selection (Left Side) */}
                        <div style={{ marginRight: 'auto', display: 'flex',  alignItems: 'center', gap: '10px' }}>
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

                        {/* Camera Button (Centered) */}
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
                <div style={styles.column}>
                    <div style={styles.box2}>
                        {emotionHistory.length > 0 && !showWebcam && (
                            <div style={{ width: '100%', height: '100%', overflowX: 'auto' }}>
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        )},
                        {/* {!showWebcam && (
                            <button onClick={handleDownloadCSV} style={styles.downloadButton}>
                                Download CSV
                            </button>
                        )} */}
                    </div>
                    <h4 style={styles.caption}>Emotion Line Chart</h4>
                    {!showWebcam && (
                            <button onClick={handleDownloadCSV} 
                            style={{
                                ...styles.downloadButton, 
                                ...(isHovered ? styles.downloadbuttonHover : {}) 
                            }}>
                                Download CSV
                            </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    row: {
        display: 'flex', // Makes it a flex container
        flexDirection: 'column', // Stacks items vertically
        alignItems: 'center', // Centers content horizontally
        justifyContent: 'center', // Centers content vertically (if needed)
        width: '100%', // Full width of the page
        maxWidth: '1200px', // Limits the max width
        margin: '0 auto', // Centers it on the page
        padding: '20px', // Adds spacing around

    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
    },
    column: {
        flex: 1,
        margin: '10px',
        padding: '10px',
        // border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column', // Make the column a flex container
        alignItems: 'center',  //center items inside the column 
    },
    box1: {
        width: '680px', // Fixed width for the box
        height: '570px', // Fixed height for the box
        marginTop: '20px', // Margin to create space below the text
        backgroundColor: 'rgba(136, 136, 136, 0.3)', // Semi-transparent white
        border: '1px solid rgba(255, 255, 255, 0.5)', // Light border for frosted effect
        borderRadius: '10px', // Rounded corners
        backdropFilter: 'blur(10px)', // Blurry effect
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Drop shadow for depth
    },
    box2: {
        width: '680px', // Fixed width for the box
        height: '570px', // Fixed height for the box
        marginTop: '20px', // Margin to create space below the text
        backgroundColor: 'rgba(173, 173, 173, 0.3)', // Semi-transparent white
        border: '1px solid rgba(255, 255, 255, 0.5)', // Light border for frosted effect
        borderRadius: '10px', // Rounded corners
        backdropFilter: 'blur(10px)', // Blurry effect
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Drop shadow for depth
        position: 'relative', // Make sure the chart wrapper is within this
        overflow: 'hidden', // Prevent overflow outside box2
    },
   

    camerabutton: {
        marginTop: '10px',
        alignSelf: 'center',
        backgroundColor: '#4A90E2', // Nice blue color
        border: 'none', // Remove default border
        borderRadius: '50%', // Make it circular
        width: '60px', // Adjust size
        height: '60px',
        display: 'flex', // Center icon inside
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer', // Show clickable cursor
        transition: 'all 0.3s ease', // Smooth hover effect
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Add depth
    },
    camerabuttonHover: {
        backgroundColor: '#357ABD', // Darker blue on hover
        transform: 'scale(1.1)', // Slightly enlarge
    },
    
    caption: { 
        marginTop: '10px',
        alignSelf: 'center', //to align the text in the center 
    },

    downloadButton: {
        marginTop: '20px',
        backgroundColor: '#4A90E2',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    downloadbuttonHover: {
        backgroundColor: '#357ABD', // Darker blue on hover
        transform: 'scale(1.1)', // Slightly enlarge
    },
  }

  

export default FacialExpressionRecognition; 