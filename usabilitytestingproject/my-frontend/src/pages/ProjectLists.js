import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';


function ProjectLists(){
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch projects from the API
        axios.get('http://127.0.0.1:8000/list-projects/')
        .then(response => {
            console.log(response.data); // Log response

        setProjects(response.data);
        })
        .catch(error => {
        console.error('Error fetching projects:', error);
        });
    }, []);

    return(
        <div>
            {projects.length > 0 ? (
                // projects.map(project => (
                //     <div key={project.id} style={styles.projectBox}>
                //         <h2>{project.project_name}</h2>
                //         <p><strong>Website:</strong> <a href={project.website_url}>{project.website_url}</a></p>
                //         <p><strong>Description:</strong> {project.description}</p>
                //         <p><strong>Sample Size:</strong> {project.sample_size}</p>
                //     </div>
                // ))
                <table style={styles.table}>
                    <thead>
                        <tr>
                        <th style={styles.th}>Project Name</th>
                        <th style={styles.th}>Website</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Sample Size</th>
                        <th style={styles.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                        <tr key={project.id} style={styles.tr}>
                            <td style={styles.td}>{project.project_name}</td>
                            <td style={styles.td}>
                                <a href={project.website_url}>{project.website_url}</a>
                            </td>
                            <td style={styles.td}>{project.description}</td>
                            <td style={styles.td}>{project.sample_size}</td>
                            <td style={styles.th}>
                                <Link to="/project-main-page">
                                    <button style={styles.proceedButton}>Details</button>        
                                </Link>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No projects found.</p>
            )}
        </div>
    )

}

const styles = {
    projectBox: {
      border: '1px solid #ddd',
      padding: '20px',
      margin: '10px 0',
      borderRadius: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
      },
      th: {
        backgroundColor: '#f4f4f4',
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'left',
      },
      tr: {
        borderBottom: '1px solid #ddd',
      },
      td: {
        padding: '10px',
        border: '1px solid #ddd',
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

export default ProjectLists 