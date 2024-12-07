// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TasksList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch tasks from the backend when the component is mounted
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/list-tasks/'); // Update URL based on your API endpoint
//         setTasks(response.data);  // Set the tasks from the backend
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching tasks!');
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div style={{ color: 'white', padding: '20px', margin: '0 auto', maxWidth: '800px' }}>
//       <h2>Tasks List</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//         <thead style={{color: 'green'}}>
//           <tr>
//             <th style={styles.tableHeader}>Task Number</th>
//             <th style={styles.tableHeader}>Task Name</th>
//             <th style={styles.tableHeader}>Participant Name</th>
//             <th style={styles.tableHeader}>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task, index) => (
//             <tr key={task.id}>
//               <td style={styles.tableCell}>{task.task_number}</td>
//               <td style={styles.tableCell}>{task.task_name}</td>
//               <td style={styles.tableCell}>{task.participant_name}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Styles for the table
// const styles = {
//   tableHeader: {
//     padding: '10px',
//     backgroundColor: '#f2f2f2',
//     borderBottom: '2px solid #ddd',
//   },
//   tableCell: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//     textAlign: 'left',
//   },
// };

// export default TasksList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks from the backend when the component is mounted
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/list-tasks/'); // Update URL based on your API endpoint
        setTasks(response.data); // Set the tasks from the backend
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks!');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) {
      return; // Exit if the user cancels the action
    }
  
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-task/${taskId}/`); // Backend endpoint to delete a task
      // Remove the deleted task from the state
      setTasks(tasks.filter((task) => task.id !== taskId));
      alert('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete the task.');
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ color: 'white', padding: '20px', margin: '0 auto', maxWidth: '800px' }}>
      <h2>Tasks List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ color: 'green' }}>
          <tr>
            <th style={styles.tableHeader}>Task Number</th>
            <th style={styles.tableHeader}>Task Name</th>
            <th style={styles.tableHeader}>Participant Name</th>
            <th style={styles.tableHeader}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={styles.tableCell}>{task.task_number}</td>
              <td style={styles.tableCell}>{task.task_name}</td>
              <td style={styles.tableCell}>{task.participant_name}</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableHeader: {
    padding: '10px',
    backgroundColor: '#f2f2f2',
    borderBottom: '2px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default TasksList;

