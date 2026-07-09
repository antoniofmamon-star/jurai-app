import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas de autenticação
import Login from './pages/auth/Login';
import Registo from './pages/auth/Registo';

// Páginas do administrador
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBancas from './pages/admin/AdminBancas';
import AdminDetalhesBanca from './pages/admin/AdminDetalhesBanca';
import AdminCriarBanca from './pages/admin/AdminCriarBanca';
import AdminUtilizadores from './pages/admin/AdminUtilizadores';
import AdminPendentes from './pages/admin/AdminPendentes';
import AdminIA from './pages/admin/AdminIA';

// Páginas do docente
import DocenteDashboard from './pages/docente/DocenteDashboard';
import DocenteCurriculo from './pages/docente/DocenteCurriculo';
import DocenteBancas from './pages/docente/DocenteBancas';
import DocenteIA from './pages/docente/DocenteIA';

// Páginas do estudante
import EstudanteDashboard from './pages/estudante/EstudanteDashboard';

// Componente de rota protegida
function RotaProtegida({ children, perfil }) {
  const { utilizador, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-primary-900 font-bold text-lg">J</span>
          </div>
          <p className="text-white text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!utilizador) return <Navigate to="/login" replace />;
  if (perfil && utilizador.perfil !== perfil) {
    return <Navigate to={`/${utilizador.perfil}`} replace />;
  }

  return children;
}

function AppRoutes() {
  const { utilizador } = useAuth();

  return (
    <Routes>
      {/* Rota raiz — redireciona conforme o perfil */}
      <Route
        path="/"
        element={
          utilizador
            ? <Navigate to={`/${utilizador.perfil}`} replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Autenticação */}
      <Route path="/login" element={<Login />} />
      <Route path="/registo" element={<Registo />} />

      {/* Administrador */}
      <Route path="/admin" element={<RotaProtegida perfil="admin"><AdminDashboard /></RotaProtegida>} />
      <Route path="/admin/bancas" element={<RotaProtegida perfil="admin"><AdminBancas /></RotaProtegida>} />
      <Route path="/admin/bancas/criar" element={<RotaProtegida perfil="admin"><AdminCriarBanca /></RotaProtegida>} />
      <Route path="/admin/bancas/:id" element={<RotaProtegida perfil="admin"><AdminDetalhesBanca /></RotaProtegida>} />
      <Route path="/admin/utilizadores" element={<RotaProtegida perfil="admin"><AdminUtilizadores /></RotaProtegida>} />
      <Route path="/admin/pendentes" element={<RotaProtegida perfil="admin"><AdminPendentes /></RotaProtegida>} />
      <Route path="/admin/ia" element={<RotaProtegida perfil="admin"><AdminIA /></RotaProtegida>} />

      {/* Docente */}
      <Route path="/docente" element={<RotaProtegida perfil="docente"><DocenteDashboard /></RotaProtegida>} />
      <Route path="/docente/curriculo" element={<RotaProtegida perfil="docente"><DocenteCurriculo /></RotaProtegida>} />
      <Route path="/docente/bancas" element={<RotaProtegida perfil="docente"><DocenteBancas /></RotaProtegida>} />
      <Route path="/docente/ia" element={<RotaProtegida perfil="docente"><DocenteIA /></RotaProtegida>} />

      {/* Estudante */}
      <Route path="/estudante" element={<RotaProtegida perfil="estudante"><EstudanteDashboard /></RotaProtegida>} />

      {/* Página não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}