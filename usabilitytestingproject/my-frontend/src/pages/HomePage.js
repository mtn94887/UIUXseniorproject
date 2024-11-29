import React from 'react';

import { Link } from 'react-router-dom';


function HomePage(){
    return (
        <div>
            <header className='App-header '>
            <h1>Koala Usability Testing</h1>
            </header>
            <div className="boxes-wrapper">
                <div className="box-container">
                    <Link to="/new-project-options" className="box-item">
                        <div className="box">
                        <span className="plus-sign">+</span>
                        </div>
                        <p className="box-label">New Project</p>
                    </Link>
                </div>
                <div className="box-container">
                    <Link to="/project-list" className="box-item">
                        <div className="box">
                        <span className="plus-sign">~</span>
                        </div>
                        <p className="box-label">Continue with the previous projects</p>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}


export default HomePage; 