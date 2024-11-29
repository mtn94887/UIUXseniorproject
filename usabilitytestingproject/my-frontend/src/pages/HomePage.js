import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

//import { FaEdit } from 'react-icons/fa';

function HomePage(){
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch projects from the API
        axios.get('http://127.0.0.1:8000/list-projects/')
        .then(response => {
        setProjects(response.data);
        })
        .catch(error => {
        console.error('Error fetching projects:', error);
        });
    }, []);

    return (
        <div>
            <header className="App-header">
                <h1>Koala Usability Testing</h1>
                <div className="box-container">
                    <Link to="/new-project-options" className="box-item">
                        <div className="box">
                        <span className="plus-sign">+</span>
                        </div>
                        <p className="box-label">New Project</p>
                    </Link>
                </div>
                    
            </header>
            {projects.map(project => (
                        <div key={project.id} style={styles.projectBox}>
                            <h2>{project.project_name}</h2>
                            <p><strong>Website:</strong> <a href={project.website_url}>{project.website_url}</a></p>
                            <p><strong>Description:</strong> {project.description}</p>
                            <p><strong>Sample Size:</strong> {project.sample_size}</p>
                        </div>
                    ))}
        </div>
    );
}

const styles = {
    projectBox: {
      border: '1px solid #ddd',
      padding: '20px',
      margin: '10px 0',
      borderRadius: '8px',
    },
  };
export default HomePage; 