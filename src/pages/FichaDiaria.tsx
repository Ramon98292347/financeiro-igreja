import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, FileText, Save, X, Download, Mail, PlusCircle, ArrowRight } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import RegistroDiarioCard from '../components/FichaDiaria/RegistroDiarioCard';
import RegistrarEntradaModal from '../components/FichaDiaria/RegistrarEntradaModal';
import { getCurrentDateBrazil } from '../lib/dateUtils';

interface MonthlySheet {
  pdaCode: string;
  unitType: 'estadual' | 'setorial' | 'central' | 'regional' | 'local';
  month: number;
  year: number;
  hasSafeBox: boolean | null;
  selfSustaining: 'sim' | 'nao' | 'as-vezes' | null;
  reasonIfNot: string;
  closingDate: string;
}

interface RegistroDiario {
  id: string;
  date: string;
  cashAmount: number;
  responsible1?: string;
  responsible2?: string;
  responsible3?: string;
  transfer?: number;
  missionaryOffering?: number;
  missionaryResponsible?: string;
}

const FichaDiaria: React.FC = () => {
  const { transactions } = useFinance();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [showRegistrarEntradaModal, setShowRegistrarEntradaModal] = useState(false);
  const [registrosDiarios, setRegistrosDiarios] = useState<RegistroDiario[]>([]);
  const [transferenciaMesAnterior, setTransferenciaMesAnterior] = useState(0);
  
  const [monthlySheet, setMonthlySheet] = useState<MonthlySheet>({
    pdaCode: '',
    unitType: 'local',
    month: selectedMonth,
    year: selectedYear,
    hasSafeBox: null,
    selfSustaining: null,
    reasonIfNot: '',
    closingDate: getCurrentDateBrazil()
  });

  // Carregar registros diários e entradas salvas da contagem do dia
  useEffect(() => {
    const savedRegistros = localStorage.getItem('registrosDiarios');
    const entradasSalvas = localStorage.getItem('entradasSalvas');
    
    let registros: RegistroDiario[] = [];
    
    if (savedRegistros) {
      registros = JSON.parse(savedRegistros);
    }
    
    // Carregar entradas da contagem do dia e criar um card consolidado por dia
    if (entradasSalvas) {
      const entradas = JSON.parse(entradasSalvas);
      
      // Agrupar entradas por data
      const entradasPorData = entradas.reduce((acc: any, entrada: any) => {
        const data = entrada.date;
        if (!acc[data]) {
          acc[data] = {
            dizimos: { total: 0, dinheiro: 0, pix: 0, cartao: 0 },
            ofertas: { total: 0, dinheiro: 0, pix: 0, cartao: 0 },
            ofertasMissionarias: { total: 0, dinheiro: 0, pix: 0, cartao: 0 },
            responsaveis: new Set()
          };
        }
        
        if (entrada.type === 'dizimos') {
          acc[data].dizimos.total += entrada.total;
          acc[data].dizimos.dinheiro += entrada.dinheiro || 0;
          acc[data].dizimos.pix += entrada.pix || 0;
          acc[data].dizimos.cartao += entrada.cartao || 0;
        } else if (entrada.type === 'ofertas') {
          acc[data].ofertas.total += entrada.total;
          acc[data].ofertas.dinheiro += entrada.dinheiro || 0;
          acc[data].ofertas.pix += entrada.pix || 0;
          acc[data].ofertas.cartao += entrada.cartao || 0;
        } else if (entrada.type === 'ofertas-missionarias') {
          acc[data].ofertasMissionarias.total += entrada.total;
          acc[data].ofertasMissionarias.dinheiro += entrada.dinheiro || 0;
          acc[data].ofertasMissionarias.pix += entrada.pix || 0;
          acc[data].ofertasMissionarias.cartao += entrada.cartao || 0;
        }
        
        if (entrada.responsible1) acc[data].responsaveis.add(entrada.responsible1);
        if (entrada.responsible2) acc[data].responsaveis.add(entrada.responsible2);
        if (entrada.responsible3) acc[data].responsaveis.add(entrada.responsible3);
        
        return acc;
      }, {});
      
      // Criar registros consolidados por data
      const registrosFromContagem = Object.entries(entradasPorData).map(([data, totais]: [string, any]) => {
        const totalGeral = totais.dizimos.total + totais.ofertas.total + totais.ofertasMissionarias.total;
        const responsaveisArray = Array.from(totais.responsaveis);
        
        // Calcular total de transferências das entradas do dia
        const totalTransferencias = entradas
          .filter((entrada: any) => entrada.date === data)
          .reduce((sum: number, entrada: any) => sum + (entrada.transfer || 0), 0);
        
        return {
          id: `contagem-consolidado-${data}`,
          date: data,
          cashAmount: totalGeral,
          responsible1: responsaveisArray[0] || '',
          responsible2: responsaveisArray[1] || '',
          responsible3: responsaveisArray[2] || '',
          transfer: totalTransferencias,
          missionaryOffering: totais.ofertasMissionarias.total,
          missionaryResponsible: '',
          // Dados detalhados para exibição
          detalhes: {
            dizimos: totais.dizimos,
            ofertas: totais.ofertas,
            ofertasMissionarias: totais.ofertasMissionarias
          }
        };
      });
      
      // Combinar registros existentes com os da contagem do dia
      const todosRegistros = [...registros, ...registrosFromContagem];
      
      // Remover duplicatas baseado na data
      const registrosUnicos = todosRegistros.filter((registro, index, self) => 
        index === self.findIndex((r) => r.date === registro.date)
      );
      
      setRegistrosDiarios(registrosUnicos);
    } else {
      setRegistrosDiarios(registros);
    }
  }, []);

  // Carregar transferência do mês anterior salva
  useEffect(() => {
    const savedTransferencia = localStorage.getItem('transferenciaMesAnterior');
    if (savedTransferencia) {
      setTransferenciaMesAnterior(parseFloat(savedTransferencia));
    }
  }, []);

  // Calcular totais dos registros salvos incluindo transferência
  const totals = {
    totalCash: registrosDiarios.reduce((sum, registro) => sum + registro.cashAmount, 0),
    totalTransfer: registrosDiarios.reduce((sum, registro) => sum + (registro.transfer || 0), 0),
    totalMissionary: registrosDiarios.reduce((sum, registro) => sum + (registro.missionaryOffering || 0), 0),
    transferenciaMesAnterior: transferenciaMesAnterior
  };
  const grandTotal = totals.totalCash + totals.totalTransfer - totals.totalMissionary + totals.transferenciaMesAnterior;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleRegistrarEntrada = (data: any) => {
    const novoRegistro: RegistroDiario = {
      id: Date.now().toString(),
      date: getCurrentDateBrazil(),
      cashAmount: data.cashAmount,
      responsible1: data.responsible1,
      responsible2: data.responsible2,
      responsible3: data.responsible3,
      transfer: data.transfer,
      missionaryOffering: data.missionaryOffering,
      missionaryResponsible: data.missionaryResponsible
    };

    const novosRegistros = [...registrosDiarios, novoRegistro];
    setRegistrosDiarios(novosRegistros);
    localStorage.setItem('registrosDiarios', JSON.stringify(novosRegistros));
  };

  const handleDeleteRegistro = (id: string) => {
    const novosRegistros = registrosDiarios.filter(registro => registro.id !== id);
    setRegistrosDiarios(novosRegistros);
    localStorage.setItem('registrosDiarios', JSON.stringify(novosRegistros));
  };

  const handleExportPDF = () => {
    alert('Funcionalidade de exportação PDF em desenvolvimento');
  };

  const handleSendEmail = () => {
    alert('Funcionalidade de envio por email em desenvolvimento');
  };

  const handleSaveTransferencia = () => {
    localStorage.setItem('transferenciaMesAnterior', transferenciaMesAnterior.toString());
    alert('Transferência do mês anterior salva com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-[#1A237E]" />
            Ficha Diária - {monthNames[selectedMonth]} {selectedYear}
          </h1>
          <p className="text-gray-600">Controle de entradas financeiras mensais</p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <select
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('-').map(Number);
              setSelectedMonth(month);
              setSelectedYear(year);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={`${i}-${selectedYear}`}>
                {monthNames[i]} {selectedYear}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowRegistrarEntradaModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Registrar Entrada
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
          <button
            onClick={handleSendEmail}
            className="flex items-center px-4 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar
          </button>
        </div>
      </div>

      {/* Campos Fixos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código PDA
            </label>
            <input
              type="text"
              value={monthlySheet.pdaCode}
              onChange={(e) => setMonthlySheet(prev => ({ ...prev, pdaCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Ex: 1930"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Unidade
            </label>
            <select
              value={monthlySheet.unitType}
              onChange={(e) => setMonthlySheet(prev => ({ ...prev, unitType: e.target.value as any }))}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Fechamento
            </label>
            <input
              type="date"
              value={monthlySheet.closingDate}
              onChange={(e) => setMonthlySheet(prev => ({ ...prev, closingDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Input Transferência do Mês Anterior */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transferência do Mês Anterior</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor da Transferência Recebida
            </label>
            <input
              type="number"
              step="0.01"
              value={transferenciaMesAnterior}
              onChange={(e) => setTransferenciaMesAnterior(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="0,00"
            />
          </div>
          <button
            onClick={handleSaveTransferencia}
            className="flex items-center px-4 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>

      {/* Registros Diários */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Entradas do Dia</h2>
        {registrosDiarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrosDiarios.map((registro) => (
              <RegistroDiarioCard
                key={registro.id}
                registro={registro}
                onDelete={handleDeleteRegistro}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma entrada registrada ainda.</p>
            <p className="text-sm mt-1">Use o botão "Registrar Entrada" para adicionar entradas.</p>
          </div>
        )}
      </div>

      {/* Resumo de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Entradas Dinheiro</h3>
          <p className="text-2xl font-bold text-green-600">
            R$ {totals.totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Transferências</h3>
          <p className="text-2xl font-bold text-blue-600">
            R$ {totals.totalTransfer.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Ofertas Missionárias</h3>
          <p className="text-2xl font-bold text-purple-600">
            R$ {totals.totalMissionary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Transferência Mês Anterior</h3>
          <p className="text-2xl font-bold text-orange-600">
            R$ {totals.transferenciaMesAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total Geral Consolidado</h3>
          <p className="text-2xl font-bold text-[#1A237E]">
            R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Parte Financeira */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Parte Financeira</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              A livraria dessa igreja possui cofre modelo boca de lobo?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasSafeBox"
                  value="true"
                  checked={monthlySheet.hasSafeBox === true}
                  onChange={() => setMonthlySheet(prev => ({ ...prev, hasSafeBox: true }))}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasSafeBox"
                  value="false"
                  checked={monthlySheet.hasSafeBox === false}
                  onChange={() => setMonthlySheet(prev => ({ ...prev, hasSafeBox: false }))}
                  className="mr-2"
                />
                Não
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              A igreja consegue se manter financeiramente com as ofertas?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selfSustaining"
                  value="sim"
                  checked={monthlySheet.selfSustaining === 'sim'}
                  onChange={() => setMonthlySheet(prev => ({ ...prev, selfSustaining: 'sim' }))}
                  className="mr-2"
                />
                Sim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selfSustaining"
                  value="nao"
                  checked={monthlySheet.selfSustaining === 'nao'}
                  onChange={() => setMonthlySheet(prev => ({ ...prev, selfSustaining: 'nao' }))}
                  className="mr-2"
                />
                Não
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selfSustaining"
                  value="as-vezes"
                  checked={monthlySheet.selfSustaining === 'as-vezes'}
                  onChange={() => setMonthlySheet(prev => ({ ...prev, selfSustaining: 'as-vezes' }))}
                  className="mr-2"
                />
                Às vezes
              </label>
            </div>
          </div>

          {monthlySheet.selfSustaining === 'nao' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Se não, qual o motivo?
              </label>
              <textarea
                value={monthlySheet.reasonIfNot}
                onChange={(e) => setMonthlySheet(prev => ({ ...prev, reasonIfNot: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
                rows={3}
                placeholder="Descreva o motivo..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 pb-6">
        <button
          onClick={() => {
            localStorage.setItem('monthlySheet', JSON.stringify(monthlySheet));
            alert('Ficha salva com sucesso!');
          }}
          className="flex items-center px-6 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-[#0D47A1] transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Ficha
        </button>
      </div>

      {/* Modal de Registrar Entrada */}
      <RegistrarEntradaModal
        isOpen={showRegistrarEntradaModal}
        onClose={() => setShowRegistrarEntradaModal(false)}
        onSave={handleRegistrarEntrada}
      />
    </div>
  );
};

export default FichaDiaria;
