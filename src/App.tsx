import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Helper component to guard authenticated user views
const AuthGuard: React.FC<{ children: React.ReactNode; requiredRole?: 'admin' | 'user' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If user is trying to hit admin but is normal role, or viceversa
    return <Navigate to={user.role === 'admin' ? '/admin' : '/usuario/reportes'} replace />;
  }

  return <>{children}</>;
};

// Root route handler redirect depending on authentication/role
const RootRedirect: React.FC = () => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'admin' ? '/admin' : '/usuario/reportes'} replace />;
};

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* User Dashboard Routes */}
            <Route 
              path="/usuario" 
              element={
                <AuthGuard requiredRole="user">
                  <UserDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/usuario/reportes" 
              element={
                <AuthGuard requiredRole="user">
                  <UserDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/usuario/crear" 
              element={
                <AuthGuard requiredRole="user">
                  <UserDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/usuario/mapa" 
              element={
                <AuthGuard requiredRole="user">
                  <UserDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/usuario/chats" 
              element={
                <AuthGuard requiredRole="user">
                  <UserDashboard />
                </AuthGuard>
              } 
            />


            {/* Admin Dashboard Page */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard requiredRole="admin">
                  <AdminDashboard />
                </AuthGuard>
              } 
            />

            {/* Fallbacks */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-[#252D26] text-[#D9C5B2] py-10 mt-auto border-t border-[#E9E1D4]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start space-y-1">
              <span className="text-white font-serif italic text-base tracking-tight">Sanos y Salvos</span>
              <p className="text-xs text-[#D9C5B2]/60 text-center md:text-left">
                © {new Date().getFullYear()} Sanos y Salvos. Uniendo familias, una mascota a la vez.
              </p>
            </div>
            
            <div className="flex gap-6 text-xs font-semibold text-[#D9C5B2]/70">
              <a href="#pro-privacity" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#pro-terms" className="hover:text-white transition-colors">Términos de Servicio</a>
              <a href="#pro-contact" className="hover:text-white transition-colors">Soporte y Contacto</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
