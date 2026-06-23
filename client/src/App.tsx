import { useState, useEffect } from 'react';
import { useAppSelector } from './store';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth/Auth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const agent = useAppSelector((state) => state.auth.agent);
  
  const [activePage, setActivePage] = useState<'home' | 'auth'>('home');
  const [activeTab, setActiveTab] = useState<string>('search');

  // Handle URL updates based on current state
  useEffect(() => {
    const currentPath = window.location.pathname;

    if (isLoggedIn) {
      const targetPath = agent?.role === 'Admin' ? '/admin' : '/agent';
      if (currentPath !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    } else {
      const targetPath = activePage === 'auth' ? '/login' : '/';
      if (currentPath !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, [isLoggedIn, agent?.role, activePage]);

  // Handle back/forward navigation or initial path checks
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      if (path === '/login') {
        setActivePage('auth');
      } else {
        setActivePage('home');
      }
    };

    handleLocationCheck();
    window.addEventListener('popstate', handleLocationCheck);
    return () => window.removeEventListener('popstate', handleLocationCheck);
  }, []);

  // Routing conditions
  if (isLoggedIn) {
    const isAdmin = agent?.role === 'Admin';
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {isAdmin ? (
          <AdminDashboard activeTab={activeTab} />
        ) : (
          <Dashboard activeTab={activeTab} />
        )}
      </DashboardLayout>
    );
  }

  // Not logged in routing
  if (activePage === 'auth') {
    return <Auth onBackToHome={() => setActivePage('home')} />;
  }

  return <Home onEnterPortal={() => setActivePage('auth')} />;
}

export default App;
