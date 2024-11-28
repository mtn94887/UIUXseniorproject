// src/pages/NewProject.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCogs, FaGlobeAmericas } from 'react-icons/fa';

function NewProject() {
  return (
    <div className="App">
      <header className="App-header">
        {/* New Boxes: Prototype and Website */}
        <div className="box-container">
          {/* Prototype Box */}
          <div className="box-item">
            <div className="box">
              <FaCogs size={50} color="#61dafb" /> {/* Icon for Prototype */}
            </div>
            <p className="box-label">Prototype</p>
          </div>

          {/* Website Box */}
          <div className="box-item">
            <Link to="/new-website-project" className="box">
              <FaGlobeAmericas size={50} color="#61dafb" /> {/* Icon for Website */}
            </Link>
            <p className="box-label">Website</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default NewProject;