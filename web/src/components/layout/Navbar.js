import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Users, Clock,
  LogOut, ChevronDown, Bot, User, Menu, X
} from 'lucide-react';

const menuAdmin = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Bancas', icon: FileText, path: '/admin/bancas' },
  { label: 'Utilizadores', icon: Users, path: '/admin/utilizadores' },
  { label: 'Pendentes', icon: Clock, path: '/admin/pendentes' },
  { label: 'Agente IA', icon: Bot, path: '/admin/ia' },
];

const menuDocente = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/docente' },
  { label: 'O meu currículo', icon: FileText, path: '/docente/curriculo' },
  { label: 'As minhas bancas', icon: Users, path: '/docente/bancas' },
  { label: 'Agente IA', icon: Bot, path: '/docente/ia' },
];

const menuEstudante = [
  { label: 'O meu processo', icon: LayoutDashboard, path: '/estudante' },
  { label: 'Perfil', icon: User, path: '/estudante/perfil' },
];

export default function Navbar() {
  const { utilizador, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);

  const menu = utilizador?.perfil === 'admin' ? menuAdmin
    : utilizador?.perfil === 'docente' ? menuDocente
    : menuEstudante;

  const iniciais = utilizador?.nome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <nav className="bg-primary-900 border-b border-primary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center">
              <span className="text-primary-900 font-semibold text-sm">J</span>
            </div>
            <div>
              <div className="text-white font-semibold tracking-widest text-base leading-none">
                JURAI
              </div>
              <div className="text-primary-300 text-xs leading-none mt-0.5">
                UNIKIVI · Uíge, Angola
              </div>
            </div>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const activo = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activo
                      ? 'bg-gold-500/15 text-gold-400'
                      : 'text-primary-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* PERFIL */}
          <div className="hidden md:flex items-center gap-3">
            {/* Badge do perfil */}
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              utilizador?.perfil === 'admin' ? 'bg-gold-500/20 text-gold-400' :
              utilizador?.perfil === 'docente' ? 'bg-blue-500/20 text-blue-300' :
              'bg-green-500/20 text-green-300'
            }`}>
              {utilizador?.perfil === 'admin' ? 'Administrador' :
               utilizador?.perfil === 'docente' ? 'Docente' : 'Estudante'}
            </span>

            {/* Dropdown do utilizador */}
            <div className="relative">
              <button
                onClick={() => setPerfilAberto(!perfilAberto)}
                className="flex items-center gap-2 text-primary-200 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 text-xs font-semibold">
                  {iniciais}
                </div>
                <span className="text-sm max-w-32 truncate">{utilizador?.nome}</span>
                <ChevronDown size={14} />
              </button>

              {perfilAberto && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">{utilizador?.nome}</p>
                    <p className="text-xs text-gray-500 truncate">{utilizador?.email}</p>
                  </div>
                  <button
                    onClick={() => { setPerfilAberto(false); navigate(`/${utilizador?.perfil}/perfil`); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} />
                    O meu perfil
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Terminar sessão
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MENU MOBILE */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE EXPANDIDO */}
      {menuAberto && (
        <div className="md:hidden border-t border-primary-800 px-4 py-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const activo = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activo
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-primary-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-primary-800 pt-3 mt-2">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 w-full"
            >
              <LogOut size={16} />
              Terminar sessão
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}