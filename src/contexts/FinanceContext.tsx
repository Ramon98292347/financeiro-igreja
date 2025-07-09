
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, CashCount, ExpenseCategory, FinanceContextType } from '../types';
import { useAuth } from './AuthContext';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashCounts, setCashCounts] = useState<CashCount[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    if (user) {
      // Simular carregamento de dados do usuário
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    // Dados simulados - em produção viria da API
    const defaultCategories: ExpenseCategory[] = [
      { id: '1', name: 'Alimentação', color: '#FF6F00', userId: user!.id },
      { id: '2', name: 'Transporte', color: '#4CAF50', userId: user!.id },
      { id: '3', name: 'Utilidades', color: '#2196F3', userId: user!.id },
      { id: '4', name: 'Educação', color: '#9C27B0', userId: user!.id },
    ];
    
    setCategories(defaultCategories);
    
    // Carregar dados salvos do localStorage
    const savedTransactions = localStorage.getItem(`transactions_${user!.id}`);
    const savedCashCounts = localStorage.getItem(`cashCounts_${user!.id}`);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedCashCounts) {
      setCashCounts(JSON.parse(savedCashCounts));
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user!.id
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem(`transactions_${user!.id}`, JSON.stringify(updatedTransactions));
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...transaction } : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem(`transactions_${user!.id}`, JSON.stringify(updatedTransactions));
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem(`transactions_${user!.id}`, JSON.stringify(updatedTransactions));
  };

  const saveCashCount = (cashCount: Omit<CashCount, 'id' | 'userId'>) => {
    const newCashCount: CashCount = {
      ...cashCount,
      id: Date.now().toString(),
      userId: user!.id
    };
    
    const updatedCashCounts = [...cashCounts, newCashCount];
    setCashCounts(updatedCashCounts);
    localStorage.setItem(`cashCounts_${user!.id}`, JSON.stringify(updatedCashCounts));
  };

  const addCategory = (category: Omit<ExpenseCategory, 'id' | 'userId'>) => {
    const newCategory: ExpenseCategory = {
      ...category,
      id: Date.now().toString(),
      userId: user!.id
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
  };

  const updateCategory = (id: string, category: Partial<ExpenseCategory>) => {
    const updatedCategories = categories.map(c => 
      c.id === id ? { ...c, ...category } : c
    );
    setCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      cashCounts,
      categories,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      saveCashCount,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
