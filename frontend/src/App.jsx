import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Surgeons from './pages/Surgeons';
import Anesthesiologists from './pages/Anesthesiologists';
import Nurses from './pages/Nurses';
import OperationRooms from './pages/OperationRooms';
import Surgeries from './pages/Surgeries';
import DisplayName from './components/forms/sample';
import Login from './pages/Login';
import Register from './pages/Register';
import Hod from './pages/Hod';

// Layout component with sidebar
const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">OR Management System</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login and Register pages (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All other pages (with sidebar) */}
          <Route path="/dashboard" element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
          <Route path="/patients" element={<LayoutWithSidebar><Patients /></LayoutWithSidebar>} />
          <Route path="/surgeons" element={<LayoutWithSidebar><Surgeons /></LayoutWithSidebar>} />
          <Route path="/anesthesiologists" element={<LayoutWithSidebar><Anesthesiologists /></LayoutWithSidebar>} />
          <Route path="/nurses" element={<LayoutWithSidebar><Nurses /></LayoutWithSidebar>} />
          <Route path="/operation-rooms" element={<LayoutWithSidebar><OperationRooms /></LayoutWithSidebar>} />
          <Route path="/surgeries" element={<LayoutWithSidebar><Surgeries /></LayoutWithSidebar>} />
          <Route path="/displayname" element={<LayoutWithSidebar><DisplayName /></LayoutWithSidebar>} />
          <Route path="/hod" element={<LayoutWithSidebar><Hod /></LayoutWithSidebar>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;