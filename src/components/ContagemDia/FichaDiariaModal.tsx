
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface FichaDiariaData {
  responsible1: string;
  responsible2: string;
  responsible3: string;
  transfer: number;
  missionaryOffering: number;
  missionaryResponsible: string;
}

interface FichaDiariaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FichaDiariaData) => void;
  total: number;
}

const FichaDiariaModal: React.FC<FichaDiariaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  total
}) => {
  const [formData, setFormData] = useState<FichaDiariaData>({
    responsible1: '',
    responsible2: '',
    responsible3: '',
    transfer: 0,
    missionaryOffering: 0,
    missionaryResponsible: ''
  });

  const handleInputChange = (field: keyof FichaDiariaData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({
      responsible1: '',
      responsible2: '',
      responsible3: '',
      transfer: 0,
      missionaryOffering: 0,
      missionaryResponsible: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Save className="w-5 h-5 mr-2 text-[#1A237E]" />
            Informações da Ficha Diária
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total sendo salvo */}
          <div className="bg-[#1A237E] text-white p-3 rounded-lg">
            <p className="text-sm">Total em dinheiro:</p>
            <p className="text-xl font-bold">
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Responsáveis */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Responsáveis pela contagem:
            </label>
            
            <input
              type="text"
              value={formData.responsible1}
              onChange={(e) => handleInputChange('responsible1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Responsável 1"
            />
            
            <input
              type="text"
              value={formData.responsible2}
              onChange={(e) => handleInputChange('responsible2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Responsável 2 (opcional)"
            />
            
            <input
              type="text"
              value={formData.responsible3}
              onChange={(e) => handleInputChange('responsible3', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Responsável 3 (opcional)"
            />
          </div>

          {/* Transferências */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transferências (R$):
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.transfer || ''}
              onChange={(e) => handleInputChange('transfer', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="0,00"
            />
          </div>

          {/* Oferta Missionária */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Oferta Missionária (R$):
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.missionaryOffering || ''}
              onChange={(e) => handleInputChange('missionaryOffering', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="0,00"
            />
            
            <input
              type="text"
              value={formData.missionaryResponsible}
              onChange={(e) => handleInputChange('missionaryResponsible', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-transparent outline-none"
              placeholder="Responsável pela oferta missionária"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#1A237E] hover:bg-[#0D47A1]"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FichaDiariaModal;
