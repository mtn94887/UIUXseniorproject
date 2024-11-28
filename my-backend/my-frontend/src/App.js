// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NewProject from './pages/NewProjectOptions'; // Import NewProject component
import WebsiteProj from './pages/NewWebsiteProject'; // Import WebsiteProj component
import ProjPage from './pages/ProjectMainPage';
import HomePage from './pages/HomePage'; // Import the edit icon from react-icons

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define routes, ensuring only the correct page content is displayed */}
        <Routes>
          {/* Main Page Route */}
          <Route path="/" element={<HomePage/>}/>
          
          {/* New Project Route */}
          <Route path="/new-project-options" element={<NewProject />} />

          {/* Website Project Route */}
          <Route path="/new-website-project" element={<WebsiteProj />} />

          <Route path="/project-main-page" element={<ProjPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;