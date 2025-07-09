
import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Configuracoes: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    alerts: true
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'data', label: 'Dados', icon: Database },
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular salvamento do perfil
    alert('Perfil atualizado com sucesso!');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    // Simular exportação de dados
    alert('Dados exportados com sucesso!');
  };

  const importData = () => {
    // Simular importação de dados
    alert('Funcionalidade de importação de dados');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificações por E-mail</h4>
                    <p className="text-sm text-gray-600">Receber notificações por e-mail</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificações Push</h4>
                    <p className="text-sm text-gray-600">Receber notificações push no navegador</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Relatórios Automáticos</h4>
                    <p className="text-sm text-gray-600">Receber relatórios mensais por e-mail</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.reports}
                      onChange={(e) => handleNotificationChange('reports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Alertas de Segurança</h4>
                    <p className="text-sm text-gray-600">Receber alertas sobre atividades suspeitas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.alerts}
                      onChange={(e) => handleNotificationChange('alerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={(e) => handleSecurityChange('twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A237E]"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Ativar verificação em duas etapas para maior segurança</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Timeout de Sessão</h4>
                  <div className="flex items-center space-x-4">
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                    </select>
                    <span className="text-sm text-gray-600">de inatividade</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Expiração de Senha</h4>
                  <div className="flex items-center space-x-4">
                    <select
                      value={security.passwordExpiry}
                      onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                    >
                      <option value={30}>30 dias</option>
                      <option value={60}>60 dias</option>
                      <option value={90}>90 dias</option>
                      <option value={180}>6 meses</option>
                    </select>
                    <span className="text-sm text-gray-600">para alteração obrigatória</span>
                  </div>
                </div>
                
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalização</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Tema</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="light" defaultChecked className="mr-2 text-[#1A237E]" />
                      <span>Tema Claro</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="dark" className="mr-2 text-[#1A237E]" />
                      <span>Tema Escuro</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="theme" value="auto" className="mr-2 text-[#1A237E]" />
                      <span>Automático</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Cor Principal</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="w-8 h-8 bg-[#1A237E] rounded cursor-pointer border-2 border-gray-300"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-green-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-purple-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-red-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-orange-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-pink-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciamento de Dados</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Exportar Dados</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Baixe todos os seus dados em formato JSON ou CSV
                  </p>
                  <button
                    onClick={exportData}
                    className="px-4 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
                  >
                    Exportar Dados
                  </button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Importar Dados</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Importe dados de outros sistemas ou backups
                  </p>
                  <button
                    onClick={importData}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Importar Dados
                  </button>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">Limpar Todos os Dados</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Esta ação não pode ser desfeita. Todos os dados serão permanentemente removidos.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Limpar Dados
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-[#1A237E]" />
          Configurações
        </h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1A237E] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
