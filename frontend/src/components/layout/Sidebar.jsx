import React from 'react';
import Navbar from './Navbar';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full">
      <Navbar />
    </aside>
  );
};

export default Sidebar;
