
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowDownLeft, Save, X } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';

const CadastroSaidas: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isCustomDescription, setIsCustomDescription] = useState(false);
  const [customDescription, setCustomDescription] = useState('');

  // Gastos recorrentes mensais
  const gastosRecorrentes = [
    'Água',
    'Aluguel',
    'Correios',
    'Internet',
    'Luz',
    'Material de Limpeza',
    'Material de Santa Ceia',
    'Monitoramento',
    'Telefone'
  ];

  const saidas = transactions.filter(t => t.type === 'saida');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalDescription = isCustomDescription ? customDescription : formData.description;
    
    if (!finalDescription || !formData.amount) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const transactionData = {
      type: 'saida' as const,
      description: finalDescription,
      amount: parseFloat(formData.amount),
      category: finalDescription,
      date: formData.date
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction, transactionData);
    } else {
      addTransaction(transactionData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsCustomDescription(false);
    setCustomDescription('');
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: any) => {
    const isRecurrentExpense = gastosRecorrentes.includes(transaction.description);
    
    setFormData({
      description: isRecurrentExpense ? transaction.description : '',
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date
    });
    
    if (!isRecurrentExpense) {
      setIsCustomDescription(true);
      setCustomDescription(transaction.description);
    } else {
      setIsCustomDescription(false);
      setCustomDescription('');
    }
    
    setEditingTransaction(transaction.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta saída?')) {
      deleteTransaction(id);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ArrowDownLeft className="w-6 h-6 mr-2 text-red-600" />
            Cadastro de Saídas
          </h1>
          <p className="text-gray-600">Gerencie suas despesas e saídas financeiras</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Saída
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Total de Saídas</h3>
          <p className="text-2xl font-bold text-red-600">
            {saidas.length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Valor Total</h3>
          <p className="text-2xl font-bold text-red-600">
            R$ {saidas.reduce((sum, t) => sum + t.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Média por Saída</h3>
          <p className="text-2xl font-bold text-[#1A237E]">
            R$ {saidas.length > 0 ? (saidas.reduce((sum, t) => sum + t.amount, 0) / saidas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Histórico de Saídas</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {saidas.length > 0 ? (
                saidas.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-[#1A237E] hover:text-[#0D47A1] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma saída cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTransaction ? 'Editar Saída' : 'Nova Saída'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <select
                  value={isCustomDescription ? 'outro' : formData.description}
                  onChange={(e) => {
                    if (e.target.value === 'outro') {
                      setIsCustomDescription(true);
                      setFormData({ ...formData, description: '' });
                    } else {
                      setIsCustomDescription(false);
                      setCustomDescription('');
                      setFormData({ ...formData, description: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="">Selecione a descrição</option>
                  {gastosRecorrentes.map((gasto) => (
                    <option key={gasto} value={gasto}>
                      {gasto}
                    </option>
                  ))}
                  <option value="outro">Outro (inserir manualmente)</option>
                </select>
              </div>
              
              {isCustomDescription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição Personalizada *
                  </label>
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                    placeholder="Digite a descrição personalizada"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                  placeholder="0,00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default CadastroSaidas;
