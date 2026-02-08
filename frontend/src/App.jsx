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

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login page (no sidebar, appears first) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All other pages (with sidebar) */}
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                {/* Mobile: padding-top for navbar, Desktop: left margin for sidebar */}
                <div className="pt-16 md:pt-0 md:ml-64 min-h-screen">
                  <div className="p-4 sm:p-6 md:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">OR Management System</h1>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="patients" element={<Patients />} />
                      <Route path="surgeons" element={<Surgeons />} />
                      <Route path="anesthesiologists" element={<Anesthesiologists />} />
                      <Route path="nurses" element={<Nurses />} />
                      <Route path="operation-rooms" element={<OperationRooms />} />
                      <Route path="surgeries" element={<Surgeries />} />
                      <Route path="displayname" element={<DisplayName />} />
                      <Route path="hod" element={<Hod />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;