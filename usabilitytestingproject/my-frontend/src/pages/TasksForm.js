import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TaskForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    taskNumber: '',
    taskName: '',
    participantName: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/submit-task/', {
        task_number: formData.taskNumber,
        task_name: formData.taskName,
        participant_name: formData.participantName,
      });
      alert('Task submitted successfully!');
      setFormData({ taskNumber: '', taskName: '', participantName: '' });
      navigate('/task-list'); // Navigate to the next page (example)
    } catch (error) {
      console.error('Error submitting task:', error.response.data);
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Task Form</h1>

        {/* Task Number Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Task Number:
              <input
                type="text"
                name="taskNumber"
                value={formData.taskNumber}
                onChange={handleInputChange}
                placeholder="Enter Task Number"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Task Name Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Task Name:
              <input
                type="text"
                name="taskName"
                value={formData.taskName}
                onChange={handleInputChange}
                placeholder="Enter Task Name"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Participant Name Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Participant Name:
              <input
                type="text"
                name="participantName"
                value={formData.participantName}
                onChange={handleInputChange}
                placeholder="Enter Participant Name"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button onClick={handleSubmit} style={styles.proceedButton}>Submit</button>
      </header>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    // backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  boxContainer: {
    marginBottom: '20px',
  },
  boxItem: {
    marginBottom: '10px',
  },
  boxLabel: {
    fontWeight: 'bold',
  },
  inputField: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '5px',
  },
  proceedButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
};

export default TaskForm;
