
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Mail, Save, Printer, Calendar } from 'lucide-react';
import { Transaction } from '../../types';
import { getCurrentDateBrazil } from '../../lib/dateUtils';

interface RelatorioFinanceiroMensalProps {
  onBack: () => void;
  transactions: Transaction[];
}

interface ChurchInfo {
  pdaCode: string;
  churchType: 'estadual' | 'setorial' | 'central' | 'regional' | 'local';
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  churchName: string;
  email: string;
  isOwned: boolean;
  hasRentalContract: boolean;
  contractDuration: string;
  contractStartDate: string;
  phone1: string;
  phone2: string;
  previousResponsible: string;
  currentResponsible: string;
  reportClosingDate: string;
}

interface FinancialMovement {
  // Entradas
  checkCardPixOfferings: number;
  missionaryCheckCardPix: number;
  cashOfferings: number;
  cashTithes: number;
  missionaryCashOfferings: number;
  previousMonthTransfer: number;
  
  // Saídas - seriam carregadas das transações
  expenses: { [key: string]: number };
}

const RelatorioFinanceiroMensal: React.FC<RelatorioFinanceiroMensalProps> = ({
  onBack,
  transactions,
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
    pdaCode: '',
    churchType: 'local',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    churchName: '',
    email: '',
    isOwned: true,
    hasRentalContract: false,
    contractDuration: '',
    contractStartDate: '',
    phone1: '',
    phone2: '',
    previousResponsible: '',
    currentResponsible: '',
    reportClosingDate: getCurrentDateBrazil()
  });

  const [financialMovement, setFinancialMovement] = useState<FinancialMovement>({
    checkCardPixOfferings: 0,
    missionaryCheckCardPix: 0,
    cashOfferings: 0,
    cashTithes: 0,
    missionaryCashOfferings: 0,
    previousMonthTransfer: 0,
    expenses: {}
  });

  // Carregar dados automaticamente das transações e entradas diárias
  useEffect(() => {
    // Carregar entradas diárias salvas
    const entradasSalvas = localStorage.getItem('registrosDiarios');
    let totalEntradasDinheiro = 0;
    let totalTransferencias = 0;
    let totalOfertasMissionarias = 0;
    
    if (entradasSalvas) {
      const registros = JSON.parse(entradasSalvas);
      const registrosDoMes = registros.filter((registro: any) => {
        const registroDate = new Date(registro.date);
        return registroDate.getMonth() === currentMonth && registroDate.getFullYear() === currentYear;
      });
      
      totalEntradasDinheiro = registrosDoMes.reduce((sum: number, registro: any) => sum + (registro.cashAmount || 0), 0);
      totalTransferencias = registrosDoMes.reduce((sum: number, registro: any) => sum + (registro.transfer || 0), 0);
      totalOfertasMissionarias = registrosDoMes.reduce((sum: number, registro: any) => sum + (registro.missionaryOffering || 0), 0);
    }

    // Atualizar valores automaticamente
    setFinancialMovement(prev => ({
      ...prev,
      cashOfferings: totalEntradasDinheiro,
      previousMonthTransfer: totalTransferencias,
      missionaryCashOfferings: totalOfertasMissionarias
    }));
  }, [currentMonth, currentYear]);

  // Calcular totais automáticos
  const totalEntries = 
    financialMovement.checkCardPixOfferings +
    financialMovement.missionaryCheckCardPix +
    financialMovement.cashOfferings +
    financialMovement.cashTithes +
    financialMovement.missionaryCashOfferings +
    financialMovement.previousMonthTransfer;

  // Calcular saídas das transações
  const totalExits = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthBalance = totalEntries - totalExits;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleSave = () => {
    const reportData = {
      churchInfo,
      financialMovement,
      totals: {
        totalEntries,
        totalExits,
        monthBalance
      },
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`monthly-report-${currentYear}-${currentMonth}`, JSON.stringify(reportData));
    alert('Relatório salvo com sucesso!');
  };

  const handleExportPDF = () => {
    alert('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const handleSendEmail = () => {
    alert('Funcionalidade de envio por email em desenvolvimento');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Relatório Financeiro Mensal - {monthNames[currentMonth]} {currentYear}
          </h1>
          <p className="text-gray-600">Movimento financeiro completo da igreja</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
          <button
            onClick={handleSendEmail}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Informações da Igreja */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Igreja</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código PDA</label>
            <input
              type="text"
              value={churchInfo.pdaCode}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, pdaCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Ex: 1930"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={churchInfo.churchType}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, churchType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            >
              <option value="estadual">Estadual</option>
              <option value="setorial">Setorial</option>
              <option value="central">Central</option>
              <option value="regional">Regional</option>
              <option value="local">Local</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input
              type="text"
              value={churchInfo.neighborhood}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, neighborhood: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              value={churchInfo.city}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              value={churchInfo.state}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={churchInfo.zipCode}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, zipCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fechamento</label>
            <input
              type="date"
              value={churchInfo.reportClosingDate}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, reportClosingDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Igreja</label>
            <input
              type="text"
              value={churchInfo.churchName}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, churchName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={churchInfo.email}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Movimento Financeiro */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Movimento Financeiro do Mês</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Entradas */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-4 bg-green-50 p-3 rounded-lg">
              ENTRADAS
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Ofertas em Cheque/Cartão/Pix:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.checkCardPixOfferings}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    checkCardPixOfferings: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Ofertas Missionárias em Cheque/Cartão/Pix:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.missionaryCheckCardPix}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    missionaryCheckCardPix: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Ofertas em Dinheiro:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.cashOfferings}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    cashOfferings: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm bg-green-50"
                  readOnly
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Dízimos em Dinheiro:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.cashTithes}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    cashTithes: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Ofertas Missionárias em Dinheiro:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.missionaryCashOfferings}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    missionaryCashOfferings: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm bg-green-50"
                  readOnly
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Transferência Recebida do Mês Anterior:</label>
                <input
                  type="number"
                  step="0.01"
                  value={financialMovement.previousMonthTransfer}
                  onChange={(e) => setFinancialMovement(prev => ({ 
                    ...prev, 
                    previousMonthTransfer: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-32 px-2 py-1 border border-gray-300 rounded text-right text-sm bg-green-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Saídas */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-4 bg-red-50 p-3 rounded-lg">
              SAÍDAS
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600 italic">
                As saídas são calculadas automaticamente com base nas transações registradas no sistema.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Total de Saídas: R$ {totalExits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              {transactions.filter(t => t.type === 'saida').length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700">Detalhamento:</p>
                  {transactions
                    .filter(t => t.type === 'saida')
                    .map(transaction => (
                      <div key={transaction.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{transaction.description}:</span>
                        <span className="font-medium">R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Totais */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Totais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Total Geral de Entradas</h3>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalEntries.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Total Geral das Saídas</h3>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalExits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${monthBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Saldo do Mês</h3>
            <p className={`text-2xl font-bold ${monthBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              R$ {monthBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsáveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Anterior</label>
            <input
              type="text"
              value={churchInfo.previousResponsible}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, previousResponsible: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Atual</label>
            <input
              type="text"
              value={churchInfo.currentResponsible}
              onChange={(e) => setChurchInfo(prev => ({ ...prev, currentResponsible: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioFinanceiroMensal;
