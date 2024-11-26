import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

function HomePage(){
    return (
        <div>
            <header className="App-header">
                <h1>Koala Usability Testing</h1>
                <div className="box-container">
                <Link to="/new-project" className="box-item">
                    <div className="box">
                    <span className="plus-sign">+</span>
                    </div>
                    <p className="box-label">New Project</p>
                </Link>
                <div className="box-item">
                    <div className="box recent-project">
                    {/* Edit icon added to the second box */}
                    <FaEdit style={{ color: '#61dafb', fontSize: '24px', cursor: 'pointer' }} />
                    </div>
                    <p className="box-label">Continue with Recent Project</p>
                </div>
                </div>
            </header>
        </div>
    );
}

export default HomePage; 