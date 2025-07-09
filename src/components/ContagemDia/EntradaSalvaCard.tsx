
import React from 'react';
import { Calendar, User, Trash2, Banknote, CreditCard, Smartphone } from 'lucide-react';

interface EntradaSalva {
  id: string;
  date: string;
  total: number;
  responsible1?: string;
  responsible2?: string;
  responsible3?: string;
  type?: 'dizimos' | 'ofertas' | 'ofertas-missionarias';
  paymentMethod?: 'dinheiro' | 'pix' | 'cartao';
  dinheiro?: number;
  pix?: number;
  cartao?: number;
}

interface EntradaSalvaCardProps {
  entrada: EntradaSalva;
  onDelete: (id: string) => void;
}

const EntradaSalvaCard: React.FC<EntradaSalvaCardProps> = ({ entrada, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Definir cores baseadas no tipo
  const getCardStyles = () => {
    if (entrada.type === 'dizimos') {
      return {
        cardClass: 'bg-blue-50 border-blue-200 hover:shadow-md transition-shadow',
        titleColor: 'text-blue-800',
        totalColor: 'text-blue-600',
        iconColor: 'text-blue-600'
      };
    } else if (entrada.type === 'ofertas') {
      return {
        cardClass: 'bg-green-50 border-green-200 hover:shadow-md transition-shadow',
        titleColor: 'text-green-800',
        totalColor: 'text-green-600',
        iconColor: 'text-green-600'
      };
    } else if (entrada.type === 'ofertas-missionarias') {
      return {
        cardClass: 'bg-orange-50 border-orange-200 hover:shadow-md transition-shadow',
        titleColor: 'text-orange-800',
        totalColor: 'text-orange-600',
        iconColor: 'text-orange-600'
      };
    }
    // Fallback para entradas antigas sem tipo
    return {
      cardClass: 'bg-white border-gray-200 hover:shadow-md transition-shadow',
      titleColor: 'text-gray-800',
      totalColor: 'text-[#1A237E]',
      iconColor: 'text-gray-600'
    };
  };

  const styles = getCardStyles();

  return (
    <div className={`p-4 rounded-lg shadow-sm border ${styles.cardClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <Banknote className={`w-4 h-4 mr-2 ${styles.iconColor}`} />
            <span className={`text-sm font-semibold ${styles.titleColor}`}>
              {entrada.type === 'dizimos' ? 'Dízimos' : 
               entrada.type === 'ofertas' ? 'Ofertas' : 
               entrada.type === 'ofertas-missionarias' ? 'Ofertas Missionárias' : 'Entrada'}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="text-xs">{formatDate(entrada.date)}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(entrada.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-4">
        <p className={`text-2xl font-bold ${styles.totalColor}`}>
          R$ {entrada.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-500">Total geral</p>
      </div>

      {/* Payment Methods Breakdown */}
      {(entrada.dinheiro || entrada.pix || entrada.cartao) && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Formas de Pagamento:</p>
          <div className="grid grid-cols-1 gap-3">
            {entrada.dinheiro && entrada.dinheiro > 0 && (
              <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Dinheiro</p>
                      <p className="text-xs text-gray-500">Notas e moedas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      R$ {entrada.dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((entrada.dinheiro / entrada.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            {entrada.pix && entrada.pix > 0 && (
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">PIX/OCT</p>
                      <p className="text-xs text-gray-500">Transferências digitais</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      R$ {entrada.pix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((entrada.pix / entrada.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            {entrada.cartao && entrada.cartao > 0 && (
              <div className="bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cartão</p>
                      <p className="text-xs text-gray-500">Débito e crédito</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">
                      R$ {entrada.cartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {((entrada.cartao / entrada.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(entrada.responsible1 || entrada.responsible2 || entrada.responsible3) && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600 mb-1">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Responsáveis:</span>
          </div>
          {entrada.responsible1 && (
            <p className="text-sm text-gray-700">• {entrada.responsible1}</p>
          )}
          {entrada.responsible2 && (
            <p className="text-sm text-gray-700">• {entrada.responsible2}</p>
          )}
          {entrada.responsible3 && (
            <p className="text-sm text-gray-700">• {entrada.responsible3}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EntradaSalvaCard;
