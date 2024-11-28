import React from 'react';
import { Link } from 'react-router-dom';

//import { FaEdit } from 'react-icons/fa';

function HomePage(){
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
        </div>
    );
}

export default HomePage; 