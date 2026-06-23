import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, setDemoRole } from '../store/authSlice';
import { 
  Plane, 
  FileText, 
  DollarSign, 
  LogOut, 
  Layers, 
  Menu, 
  X, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Shield,
  Sliders,
  Users
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const dispatch = useAppDispatch();
  const agent = useAppSelector((state) => state.auth.agent);
  const ledger = useAppSelector((state) => state.booking.ledger);
  const pendingAgencies = useAppSelector((state) => state.auth.pendingAgencies);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!agent) return null;

  const isAdmin = agent.role === 'Admin';

  // Calculate pending deposits count (from global ledger)
  const pendingDepositsCount = ledger.filter(
    (t) => t.type === 'Deposit' && t.status === 'Pending'
  ).length;

  // Calculate pending agencies count
  const pendingAgenciesCount = pendingAgencies.length;

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  // Set navigation items based on role
  const agentMenuItems: MenuItem[] = [
    { id: 'search', label: 'Flight Search', icon: Plane },
    { id: 'bookings', label: 'Bookings Queue', icon: FileText },
    { id: 'ledger', label: 'Financial Ledger', icon: Layers },
    { id: 'deposit', label: 'Request Deposit', icon: DollarSign },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'admin_overview', label: 'Portal Overview', icon: LayoutDashboard },
    { id: 'admin_deposits', label: 'Deposit Approvals', icon: DollarSign, badge: pendingDepositsCount },
    { id: 'admin_agencies', label: 'Agency Verifications', icon: Users, badge: pendingAgenciesCount },
    { id: 'admin_bookings', label: 'Global Booking Logs', icon: FileText },
    { id: 'admin_settings', label: 'GDS Settings', icon: Sliders },
  ];

  const menuItems = isAdmin ? adminMenuItems : agentMenuItems;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'Agent' : 'Admin';
    dispatch(setDemoRole(nextRole));
    // Automatically switch tabs to the homepage of each view
    setActiveTab(nextRole === 'Admin' ? 'admin_overview' : 'search');
  };

  return (
    <div className="min-h-screen bg-[#01111a] bg-radial from-[#022538] to-[#01111a] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950/40 backdrop-blur-xl border-r border-white/5 p-6 justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center shadow-lg ${
              isAdmin 
                ? 'from-amber-500 to-brand-navy shadow-amber-500/20' 
                : 'from-brand-cyan to-brand-navy shadow-brand-cyan/20'
            }`}>
              {isAdmin ? (
                <Shield className="w-5 h-5 text-white" />
              ) : (
                <Plane className="w-5 h-5 text-white transform -rotate-45" />
              )}
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white tracking-wider block">FLYLOCAL</span>
              <span className={`text-[10px] font-semibold tracking-widest uppercase block ${
                isAdmin ? 'text-amber-400' : 'text-brand-cyan'
              }`}>
                {isAdmin ? 'Administration' : 'B2B Agent Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? isAdmin
                        ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/30 text-white shadow-inner shadow-amber-500/10'
                        : 'bg-gradient-to-r from-brand-cyan/15 to-brand-cyan/5 border border-brand-cyan/30 text-white shadow-inner shadow-brand-cyan/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? isAdmin ? 'text-amber-400' : 'text-brand-cyan' 
                        : 'text-slate-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-cyan/20 text-brand-cyan'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className={`w-4 h-4 ${
                        isAdmin ? 'text-amber-400' : 'text-brand-cyan'
                      }`} />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Agency Identity & Logout */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          
          {/* Demo Sandbox Mode Switcher */}
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-3 text-center space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
              Sandbox Demo Workspace
            </span>
            <button
              onClick={handleRoleToggle}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isAdmin
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/20'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Switch to {isAdmin ? 'Agent View' : 'Admin View'}</span>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${
              isAdmin ? 'bg-amber-500/15 text-amber-400' : 'bg-brand-navy-light text-brand-cyan-light'
            }`}>
              <span className="font-display font-semibold text-lg">
                {agent.companyName.charAt(0)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{agent.companyName}</p>
              <p className="text-[10px] text-slate-400 truncate">{agent.email}</p>
              <div className={`flex items-center gap-1 mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded w-max ${
                isAdmin 
                  ? 'bg-amber-500/15 text-amber-400' 
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>{isAdmin ? 'Portal Admin' : 'Verified Agent'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-[#011d2c] border-r border-white/10 p-6 justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isAdmin ? 'bg-amber-500' : 'bg-brand-cyan'
                  }`}>
                    {isAdmin ? (
                      <Shield className="w-4.5 h-4.5 text-slate-950" />
                    ) : (
                      <Plane className="w-4.5 h-4.5 text-slate-950 transform -rotate-45" />
                    )}
                  </div>
                  <span className="font-display font-bold text-lg text-white">FLYLOCAL B2B</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? isAdmin
                            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                            : 'bg-brand-cyan text-slate-950 shadow-lg shadow-brand-cyan/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActive 
                            ? 'bg-slate-950/20 text-slate-950' 
                            : isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-cyan/20 text-brand-cyan'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <button
                onClick={handleRoleToggle}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 border border-white/10 hover:text-white"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Switch to {isAdmin ? 'Agent View' : 'Admin View'}</span>
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center">
                  <span className="font-semibold text-white">{agent.companyName.charAt(0)}</span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{agent.companyName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{agent.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HUD Top Header */}
        <header className="bg-slate-950/20 backdrop-blur-md border-b border-white/5 p-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Greetings */}
            <div>
              <h1 className="text-lg lg:text-xl font-display font-semibold text-white tracking-wide">
                Welcome, {agent.name.split(' ')[0]}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {agent.companyName} • {isAdmin ? 'System Root Controller' : `Portal ID: FL-AGT-7749`}
              </p>
            </div>
          </div>

          {/* Wallet HUD Widget */}
          <div className="flex items-center gap-3">
            <div className={`glass-card flex items-center px-4 py-2.5 rounded-2xl border ${
              isAdmin ? 'border-amber-500/20' : 'border-brand-cyan/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border text-white ${
                  isAdmin 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                    : 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan animate-pulse'
                }`}>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">
                    {isAdmin ? 'System GDS Cash pool' : 'B2B Balance'}
                  </span>
                  <span className="text-sm lg:text-base font-bold font-display text-white">
                    {agent.balance.toLocaleString()} <span className={`text-xs font-medium ${
                      isAdmin ? 'text-amber-400' : 'text-brand-cyan-light'
                    }`}>{agent.currency}</span>
                  </span>
                </div>
              </div>

              {/* Pending alerts inside HUD */}
              {!isAdmin && pendingDepositsCount > 0 && (
                <div className="ml-3 pl-3 border-l border-white/10 flex items-center gap-1.5 text-amber-400" title={`${pendingDepositsCount} pending deposit request`}>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-[10px] font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                    +{pendingDepositsCount}
                  </span>
                </div>
              )}
            </div>

            {/* Role indicator widget (Admin mode) */}
            <div className="hidden sm:block">
              <span className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                isAdmin 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                  : 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan'
              }`}>
                {agent.role} MODE
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
