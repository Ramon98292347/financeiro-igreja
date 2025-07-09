import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Bell, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
interface HeaderProps {
  onMenuToggle?: () => void;
}
const Header: React.FC<HeaderProps> = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = [{
    path: '/',
    label: 'Dashboard'
  }, {
    path: '/contagem-dia',
    label: 'Contagem do Dia'
  }, {
    path: '/saidas',
    label: 'Cadastro de Saídas'
  }, {
    path: '/ficha-diaria',
    label: 'Ficha Diária'
  }, {
    path: '/relatorios',
    label: 'Relatórios'
  }, {
    path: '/configuracoes',
    label: 'Configurações'
  }];
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <header className="bg-[#1A237E] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Sistema  Financeiro</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return <NavLink key={item.path} to={item.path} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-[#3F51B5] text-white' : 'text-gray-200 hover:bg-[#3F51B5] hover:text-white'}`}>
                    {item.label}
                  </NavLink>;
            })}
            </div>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-[#3F51B5] transition-colors relative">
              <Bell size={20} className="text-gray-200" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3F51B5] rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-200">
                {user?.name}
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-[#3F51B5] transition-colors">
              {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[#3F51B5]">
              {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return <NavLink key={item.path} to={item.path} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'bg-[#3F51B5] text-white' : 'text-gray-200 hover:bg-[#3F51B5] hover:text-white'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </NavLink>;
          })}
              
              {/* Mobile User Info */}
              <div className="border-t border-[#3F51B5] pt-4 pb-3">
                <div className="flex items-center px-3">
                  <div className="w-10 h-10 bg-[#3F51B5] rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm text-gray-300">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-[#3F51B5] hover:text-white w-full text-left">
                    <Bell size={20} className="mr-3" />
                    Notificações
                  </button>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;