// src/App.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import NewProject from './pages/NewProject'; // Import NewProject component
import WebsiteProj from './pages/WebsiteProj'; // Import WebsiteProj component
import ProjPage from './pages/ProjPage';
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from react-icons

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes, ensuring only the correct page content is displayed */}
        <Routes>
          {/* Main Page Route */}
          <Route
            path="/"
            element={
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
            }
          />
          {/* New Project Route */}
          <Route path="/new-project" element={<NewProject />} />

          {/* Website Project Route */}
          <Route path="/website-project" element={<WebsiteProj />} />

          <Route path="/proj-page" element={<ProjPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
