import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import { Home, FileText, MessageSquare, LayoutTemplate, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';

import CreateFormPage from './pages/CreateFormPage';
import FormsList from './pages/FormsList';
import Responses from './pages/Responses';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Polished dashboard
const Dashboard = () => (
  <div className="p-10 max-w-7xl mx-auto">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
      <p className="text-gray-500">Welcome to the Admin Panel. Here's what's happening today.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Total Forms', value: '24', trend: '+12%' },
        { label: 'Total Responses', value: '1,493', trend: '+5%' },
        { label: 'Active Users', value: '12', trend: '+2' }
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="text-gray-500 font-medium mb-2">{stat.label}</div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-emerald-500 font-medium bg-emerald-50 px-2 py-1 rounded-md text-sm">{stat.trend}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const queryClient = new QueryClient();

const NavItem = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
  const location = useLocation();
  // Check if current path matches to, handling sub-routes like /forms/create
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 transition-colors ${isActive ? 'bg-[#5F3EE7] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-gray-900 font-sans">
      <aside className="w-[260px] bg-[#0B1135] text-white flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="p-6 flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1a2356] flex items-center justify-center border border-indigo-500/30">
              <span className="font-bold text-lg text-indigo-400">G</span>
            </div>
            <span className="text-xl font-bold">FormBuilder</span>
          </div>
          <nav className="flex flex-col space-y-1">
            <NavItem to="/" icon={Home}>Dashboard</NavItem>
            <NavItem to="/forms" icon={FileText}>Forms</NavItem>
            <NavItem to="/responses" icon={MessageSquare}>Responses</NavItem>
            <NavItem to="/templates" icon={LayoutTemplate}>Templates</NavItem>
            <NavItem to="/users" icon={Users}>Users</NavItem>
            <NavItem to="/settings" icon={Settings}>Settings</NavItem>
          </nav>
        </div>
        <div className="p-4 mb-4">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        
        {/* Decorative arrow/handle on the right edge */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-[#333959] rounded-l-md flex items-center justify-center cursor-pointer shadow-lg z-10">
          <ChevronLeft className="text-gray-400" size={20} />
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-white/50">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute requiredRole="Admin" />}>
                    <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
                    <Route path="/forms/*" element={<AdminLayout><Routes>
                        <Route path="/" element={<FormsList />} />
                        <Route path="/create" element={<CreateFormPage />} />
                        <Route path="/:id" element={<CreateFormPage />} />
                    </Routes></AdminLayout>} />
                    <Route path="/responses" element={<AdminLayout><Responses /></AdminLayout>} />
                    <Route path="/templates" element={<AdminLayout><div className="p-10"><h2 className="text-3xl font-bold">Templates</h2></div></AdminLayout>} />
                    <Route path="/users" element={<AdminLayout><div className="p-10"><h2 className="text-3xl font-bold">Users</h2></div></AdminLayout>} />
                    <Route path="/settings" element={<AdminLayout><div className="p-10"><h2 className="text-3xl font-bold">Settings</h2></div></AdminLayout>} />
                </Route>
            </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
