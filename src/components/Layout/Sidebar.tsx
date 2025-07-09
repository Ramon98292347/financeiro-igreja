
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  ArrowDownLeft, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/contagem-dia', label: 'Contagem do Dia', icon: Calculator },
    { path: '/saidas', label: 'Cadastro de Saídas', icon: ArrowDownLeft },
    { path: '/ficha-diaria', label: 'Ficha Diária', icon: FileText },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    { path: '/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-[#1A237E] text-white transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3F51B5]">
          <h2 className="text-xl font-bold">Gestão Financeira</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded hover:bg-[#3F51B5] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-[#3F51B5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3F51B5] rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[#3F51B5] text-white' 
                        : 'text-gray-300 hover:bg-[#3F51B5] hover:text-white'
                      }
                    `}
                    onClick={() => {
                      // Fechar sidebar no mobile após clique
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#3F51B5]">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 text-gray-300 hover:bg-[#3F51B5] hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
