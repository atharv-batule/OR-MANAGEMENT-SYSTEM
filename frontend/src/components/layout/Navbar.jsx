import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Stethoscope,
  Shield,
  Calendar,
  Home,
  Building,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/surgeons', label: 'Surgeons', icon: UserPlus },
    { path: '/anesthesiologists', label: 'Anesthesiologists', icon: Shield },
    { path: '/nurses', label: 'Nurses', icon: Stethoscope },
    { path: '/operation-rooms', label: 'Operation Rooms', icon: Building },
    { path: '/surgeries', label: 'Surgeries', icon: Calendar },
    { path: '/hod', label: 'HOD', icon: Calendar },

  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white shadow-md fixed top-0 left-0 w-full z-[9999]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <div>
              <h1></h1>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <nav className="fixed top-40px right-0 bg-white border-t border-gray-200 z-[9999]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white shadow-lg h-screen flex-col fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 flex items-center shadow-md">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1">
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
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    active ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
