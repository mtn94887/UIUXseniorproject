import React, { useEffect, useState } from 'react';

import axios from 'axios';

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
                projects.map(project => (
                    <div key={project.id} style={styles.projectBox}>
                        <h2>{project.project_name}</h2>
                        <p><strong>Website:</strong> <a href={project.website_url}>{project.website_url}</a></p>
                        <p><strong>Description:</strong> {project.description}</p>
                        <p><strong>Sample Size:</strong> {project.sample_size}</p>
                    </div>
                ))
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
};

export default ProjectLists 