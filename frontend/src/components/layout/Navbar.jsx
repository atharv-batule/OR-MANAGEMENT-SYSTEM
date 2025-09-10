import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Stethoscope,
  Shield,
  Calendar,
  Home,
  Building,
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/surgeons', label: 'Surgeons', icon: UserPlus },
    { path: '/anesthesiologists', label: 'Anesthesiologists', icon: Shield },
    { path: '/nurses', label: 'Nurses', icon: Stethoscope },
    { path: '/operation-rooms', label: 'Operation Rooms', icon: Building },
    { path: '/surgeries', label: 'Surgeries', icon: Calendar },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">OR Management</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
