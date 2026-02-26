import { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
