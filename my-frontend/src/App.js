// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NewProject from './pages/NewProject'; // Import NewProject component
import WebsiteProj from './pages/WebsiteProj'; // Import WebsiteProj component
import ProjPage from './pages/ProjPage';
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
