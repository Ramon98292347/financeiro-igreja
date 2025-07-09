
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { transactions, cashCounts } = useFinance();
  const navigate = useNavigate();

  // Calcular métricas
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  // Carregar entradas diárias salvas da ficha diária
  const registrosDiarios = localStorage.getItem('registrosDiarios');
  const entradasSalvas = localStorage.getItem('entradasSalvas');
  let totalEntradasDiarias = 0;
  
  // Carregar dados dos registros diários da ficha diária
  if (registrosDiarios) {
    const registros = JSON.parse(registrosDiarios);
    const registrosDoMes = registros.filter((registro: any) => {
      const registroDate = new Date(registro.date);
      return registroDate.getMonth() === currentMonth && registroDate.getFullYear() === currentYear;
    });
    
    totalEntradasDiarias += registrosDoMes.reduce((sum: number, registro: any) => {
      return sum + (registro.cashAmount || 0) + (registro.transfer || 0) + (registro.missionaryOffering || 0);
    }, 0);
  }
  
  // Carregar dados das entradas salvas da contagem do dia
  if (entradasSalvas) {
    const entradas = JSON.parse(entradasSalvas);
    const entradasDoMes = entradas.filter((entrada: any) => {
      const entradaDate = new Date(entrada.date);
      return entradaDate.getMonth() === currentMonth && entradaDate.getFullYear() === currentYear;
    });
    
    totalEntradasDiarias += entradasDoMes.reduce((sum: number, entrada: any) => {
      return sum + (entrada.total || 0);
    }, 0);
  }

  const totalEntries = monthlyTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0) + totalEntradasDiarias;

  // Calcular total geral de entradas (todas as transações + todas as contagens diárias)
  const totalGeralEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  
  let totalGeralEntradasDiarias = 0;
  
  // Somar todos os registros diários da ficha diária
  if (registrosDiarios) {
    const registros = JSON.parse(registrosDiarios);
    totalGeralEntradasDiarias += registros.reduce((sum: number, registro: any) => {
      return sum + (registro.cashAmount || 0) + (registro.transfer || 0) + (registro.missionaryOffering || 0);
    }, 0);
  }
  
  // Somar todas as entradas salvas da contagem do dia
  if (entradasSalvas) {
    const entradas = JSON.parse(entradasSalvas);
    totalGeralEntradasDiarias += entradas.reduce((sum: number, entrada: any) => {
      return sum + (entrada.total || 0);
    }, 0);
  }
  
  const totalGeralTodasEntradas = totalGeralEntradas + totalGeralEntradasDiarias;

  // Calcular totais de dízimos e ofertas por forma de pagamento
  const calculateDizimosOfertas = () => {
    const dizimos = { dinheiro: 0, pix: 0, cartao: 0, total: 0 };
    const ofertas = { dinheiro: 0, pix: 0, cartao: 0, total: 0 };
    
    if (entradasSalvas) {
      const entradas = JSON.parse(entradasSalvas);
      const entradasDoMes = entradas.filter((entrada: any) => {
        const entradaDate = new Date(entrada.date);
        return entradaDate.getMonth() === currentMonth && entradaDate.getFullYear() === currentYear;
      });
      
      entradasDoMes.forEach((entrada: any) => {
        if (entrada.type === 'dizimos') {
          dizimos.dinheiro += entrada.dinheiro || 0;
          dizimos.pix += entrada.pix || 0;
          dizimos.cartao += entrada.cartao || 0;
          dizimos.total += entrada.total || 0;
        } else if (entrada.type === 'ofertas') {
          ofertas.dinheiro += entrada.dinheiro || 0;
          ofertas.pix += entrada.pix || 0;
          ofertas.cartao += entrada.cartao || 0;
          ofertas.total += entrada.total || 0;
        }
      });
    }
    
    return { dizimos, ofertas };
  };
  
  const { dizimos, ofertas } = calculateDizimosOfertas();

  const totalExits = monthlyTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalEntries - totalExits;

  const todayCashCount = cashCounts.find(c => {
    const today = new Date().toISOString().split('T')[0];
    return c.date === today;
  });

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleContagemDia = () => {
    navigate('/contagem-dia');
  };

  const handleNovaEntrada = () => {
    navigate('/contagem-dia');
  };

  const handleNovaSaida = () => {
    navigate('/saidas');
  };

  const handleRelatorios = () => {
    navigate('/relatorios');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas finanças</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Entradas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entradas do Mês</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalEntries.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% vs mês anterior</span>
          </div>
        </div>

        {/* Total Saídas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saídas do Mês</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totalExits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">+5% vs mês anterior</span>
          </div>
        </div>

        {/* Saldo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#1A237E]" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className={`${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </span>
          </div>
        </div>

        {/* Contagem do Dia */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Caixa Hoje</p>
              <p className="text-2xl font-bold text-[#1A237E]">
                R$ {(todayCashCount?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#1A237E]" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">
              {todayCashCount ? 'Contagem realizada' : 'Contagem pendente'}
            </span>
          </div>
        </div>
      </div>

      {/* Dízimos e Ofertas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dízimos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Dízimos do Mês</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {dizimos.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Banknote className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Dinheiro</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {dizimos.dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">PIX/OCT</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {dizimos.pix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Cartão</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {dizimos.cartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Ofertas do Mês</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {ofertas.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Banknote className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Dinheiro</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {ofertas.dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">PIX/OCT</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {ofertas.pix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Cartão</span>
              </div>
              <span className="font-medium text-gray-900">
                R$ {ofertas.cartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'entrada' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'entrada' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma transação encontrada</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleContagemDia}
              className="p-4 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
            >
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Contagem do Dia</span>
            </button>
            <button 
              onClick={handleNovaEntrada}
              className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Nova Entrada</span>
            </button>
            <button 
              onClick={handleNovaSaida}
              className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrendingDown className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Nova Saída</span>
            </button>
            <button 
              onClick={handleRelatorios}
              className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Relatórios</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
