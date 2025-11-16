
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
//import SurgeonTableContainer from './components/tables/SurgeonTable';

function App() {

  
  return (
    <AppProvider>
      <Router>
      <Routes>
          {/* Login page (no sidebar, appears first) */}
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login />} />
          
          {/* All other pages (with sidebar) */}
          <Route
            path="/*"
            element={
              <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden ml-0 sm:px-0 lg:ml-63 ">
            <header className="bg-white shadow-sm border-b border-gray-200 sm:px-0">
              <div className="px-6 py-4">
                <h2 className="text-2xl font-semibold text-gray-800 mt-10 lg:mt-0">OR Management System</h2>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/register" element ={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/surgeons" element={<Surgeons />} />
                <Route path="/anesthesiologists" element={<Anesthesiologists />} />
                <Route path="/nurses" element={<Nurses />} />
                <Route path="/operation-rooms" element={<OperationRooms />} />
                <Route path="/surgeries" element={<Surgeries />} />
                <Route path="/registration" element={<DisplayName />} />
                <Route path="/hod" element={<Hod />} />
              </Routes>
            </main>
          </div>
        </div>
        }
        />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
