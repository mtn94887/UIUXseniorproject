import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';


function WebsiteProj() {
  // const [sampleSize, setSampleSize] = useState(0);

  // // Handle increase and decrease for sample size
  // const increaseSampleSize = () => setSampleSize(sampleSize + 1);
  // const decreaseSampleSize = () => setSampleSize(sampleSize > 0 ? sampleSize - 1 : 0);

  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    description: '',
    sample_size: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post('http://127.0.0.1:8000/create-project/', formData);
  //     alert('Project created successfully!');
  //     setFormData({ project_name: '', website_url: '', description: '', sample_size: 0 });
  //   } catch (error) {
  //     console.error('Error creating project:', error);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/create-project/', {
        project_name: formData.project_name,
        website_url: formData.website_url,
        description: formData.description,
        sample_size: formData.sample_size,
      });
      alert('Project created successfully!');
      setFormData({ project_name: '', website_url: '', description: '', sample_size: 0 });
    } catch (error) {
      console.error('Error creating project:', error.response.data);
    }
  };
  

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1>Website Project</h1>

        {/* Website URL Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Project Name:
              <input
                type="text"
                name="name"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Enter Project Name"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Website URL Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Website URL:
              <input
                type="text"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="Enter Website URL"
                style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Description Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Description:
              <textarea
                 name="description"
                 value={formData.description}
                 onChange={handleInputChange}
                 placeholder="Enter Description"
                 style={styles.inputField}
              />
            </label>
          </div>
        </div>

        {/* Sample Size Component */}
        <div style={styles.boxContainer}>
          <div style={styles.boxItem}>
            <label style={styles.boxLabel}>
              Sample Size:
              <button
                onClick={() => setFormData({ ...formData, sample_size: Math.max(formData.sample_size - 1, 0) })}
                style={styles.sampleButton}
              >
                -
              </button>
              <span style={styles.sampleCount}>{formData.sample_size}</span>
              <button
                onClick={() => setFormData({ ...formData, sample_size: formData.sample_size + 1 })}
                style={styles.sampleButton}
              >
                +
              </button>
            </label>
          </div>
        </div>

        {/* Proceed Button */}
        {/* <Link to="/project-main-page">
          <button style={styles.proceedButton}>Proceed</button>
        </Link> */}
        <button onClick={handleSubmit} style={styles.proceedButton}>
          Submit
        </button>
      </header>
    </div>
  );
}

// Inline styles for the WebsiteProj component
const styles = {
  app: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
  },
  header: {
    textAlign: 'center',
    color: '#61dafb',
    fontFamily: 'Arial, sans-serif',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  boxItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 10px',
  },
  boxLabel: {
    fontSize: '1em',
    color: '#61dafb',
    marginBottom: '10px',
  },
  inputField: {
    padding: '8px',
    width: '300px',
    fontSize: '1em',
    marginTop: '5px',
    borderRadius: '4px',
    border: '2px solid #61dafb',
    backgroundColor: '#282c34',
    color: 'white',
  },
  sampleButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '1.2em',
    margin: '0 10px',
    borderRadius: '4px',
  },
  sampleCount: {
    fontSize: '1.2em',
    padding: '8px',
    fontWeight: 'bold',
    color: '#61dafb',
  },
  proceedButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    padding: '12px 24px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginTop: '20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default WebsiteProj;








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function WebsiteProj() {
//   const [projectName, setProjectName] = useState('');
//   const [websiteUrl, setWebsiteUrl] = useState('');
//   const [description, setDescription] = useState('');
//   const [sampleSize, setSampleSize] = useState(0);
//   const navigate = useNavigate();

//   const increaseSampleSize = () => setSampleSize(sampleSize + 1);
//   const decreaseSampleSize = () => setSampleSize(sampleSize > 0 ? sampleSize - 1 : 0);

//   const handleProceed = async () => {
//     const projectData = {
//       project_name: projectName,
//       website_url: websiteUrl,
//       description,
//       sample_size: sampleSize,
//     };

//     try {
//       const response = await fetch('http://127.0.0.1:8000/create-project/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(projectData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Project created:', data);
//         navigate('/project-main-page'); // Navigate to the next page
//       } else {
//         console.error('Failed to create project:', response.status);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div style={styles.app}>
//       <header style={styles.header}>
//         <h1>Website Project</h1>

//         <div style={styles.boxContainer}>
//           <div style={styles.boxItem}>
//             <label style={styles.boxLabel}>
//               Project Name:
//               <input
//                 type="text"
//                 placeholder="Enter Project Name"
//                 style={styles.inputField}
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//               />
//             </label>
//           </div>
//         </div>

//         <div style={styles.boxContainer}>
//           <div style={styles.boxItem}>
//             <label style={styles.boxLabel}>
//               Website URL:
//               <input
//                 type="text"
//                 placeholder="Enter Website URL"
//                 style={styles.inputField}
//                 value={websiteUrl}
//                 onChange={(e) => setWebsiteUrl(e.target.value)}
//               />
//             </label>
//           </div>
//         </div>

//         <div style={styles.boxContainer}>
//           <div style={styles.boxItem}>
//             <label style={styles.boxLabel}>
//               Description:
//               <textarea
//                 placeholder="Enter Description"
//                 style={styles.inputField}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </label>
//           </div>
//         </div>

//         <div style={styles.boxContainer}>
//           <div style={styles.boxItem}>
//             <label style={styles.boxLabel}>
//               Sample Size:
//               <button onClick={decreaseSampleSize} style={styles.sampleButton}>-</button>
//               <span style={styles.sampleCount}>{sampleSize}</span>
//               <button onClick={increaseSampleSize} style={styles.sampleButton}>+</button>
//             </label>
//           </div>
//         </div>

//         <button onClick={handleProceed} style={styles.proceedButton}>
//           Proceed
//         </button>
//       </header>
//     </div>
//   );
// }

// // Include your styles here...
// const styles = {
//   app: {
//     textAlign: 'center',
//     fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//     backgroundColor: '#282c34',
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: 'white',
//   },
//   boxContainer: {
//     margin: '20px 0',
//   },
//   boxItem: {
//     marginBottom: '10px',
//   },
//   boxLabel: {
//     display: 'block',
//     marginBottom: '5px',
//     fontWeight: 'bold',
//   },
//   inputField: {
//     width: '300px',
//     padding: '10px',
//     fontSize: '16px',
//   },
//   sampleButton: {
//     margin: '0 10px',
//     padding: '5px 10px',
//     fontSize: '16px',
//   },
//   sampleCount: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//   },
//   proceedButton: {
//     padding: '10px 20px',
//     fontSize: '16px',
//     color: '#fff',
//     backgroundColor: '#61dafb',
//     border: 'none',
//     cursor: 'pointer',
//     borderRadius: '5px',
//   },
// };


// export default WebsiteProj;
