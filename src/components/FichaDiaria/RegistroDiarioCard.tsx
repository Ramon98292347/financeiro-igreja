
import React from 'react';
import { Calendar, User, Trash2, DollarSign } from 'lucide-react';

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

interface RegistroDiarioCardProps {
  registro: RegistroDiario;
  onDelete: (id: string) => void;
}

const RegistroDiarioCard: React.FC<RegistroDiarioCardProps> = ({ registro, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{formatDate(registro.date)}</span>
        </div>
        <button
          onClick={() => onDelete(registro.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Entradas em Dinheiro:</span>
          <span className="font-bold text-green-600 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            R$ {registro.cashAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        {registro.transfer && registro.transfer > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Transferência:</span>
            <span className="font-medium text-blue-600">
              R$ {registro.transfer.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        
        {registro.missionaryOffering && registro.missionaryOffering > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Oferta Missionária:</span>
            <span className="font-medium text-purple-600">
              R$ {registro.missionaryOffering.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {(registro.responsible1 || registro.responsible2 || registro.responsible3) && (
        <div className="space-y-1">
          <div className="flex items-center text-gray-600 mb-1">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Responsáveis:</span>
          </div>
          {registro.responsible1 && (
            <p className="text-sm text-gray-700">• {registro.responsible1}</p>
          )}
          {registro.responsible2 && (
            <p className="text-sm text-gray-700">• {registro.responsible2}</p>
          )}
          {registro.responsible3 && (
            <p className="text-sm text-gray-700">• {registro.responsible3}</p>
          )}
        </div>
      )}
      
      {registro.missionaryResponsible && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Resp. Missionária:</span> {registro.missionaryResponsible}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistroDiarioCard;
