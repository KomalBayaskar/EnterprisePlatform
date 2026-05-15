import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BrainCircuit, LogOut, Bell, Search, Settings, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'AI Usage', href: '/ai-usage', icon: BrainCircuit },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center">
            <BrainCircuit className="w-8 h-8 text-primary mr-3 animate-pulse-slow" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EnterpriseCore
            </span>
          </div>
          <button className="lg:hidden text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted hover:bg-white/5 hover:text-text'
                )}
              >
                <item.icon className={cn('w-5 h-5 mr-3', isActive ? 'text-primary' : 'text-muted group-hover:text-text')} />
                {item.name}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-muted hover:bg-white/5 hover:text-text rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center flex-1">
            <button 
              className="p-2 mr-2 -ml-2 text-muted hover:text-text lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 text-muted hover:text-text rounded-full hover:bg-white/5 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-2 hidden sm:block text-muted hover:text-text rounded-full hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ml-2 pl-2 sm:pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-text">{user?.name}</p>
                <p className="text-xs text-muted">{user?.role}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                <div className="w-full h-full rounded-full bg-surface border-2 border-surface overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Admin" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative">
          {/* Decorative background glows */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 animate-fade-in h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
