import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/Login.css';
import './components/General.css';
import './components/Administrator.css';
import './components/Report.css';

import General from './pages/General.js';
import Login from './pages/Login.js';
import Approve from './pages/Approve.js';
import Administrator from './pages/Administrator.js';
import EmployeeTurnoverRate from './pages/EmployeeTurnoverRate.js';
import Report from './pages/Report.js';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/General" element={<General />} />
          <Route path="/Approve" element={<Approve />} />
          <Route path="/Employee-Turnover-Rate" element={<EmployeeTurnoverRate />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Administrator" element={<Administrator />} />
        </Routes>
    </Router>
  );
}

export default App;
