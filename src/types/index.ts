
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  amount: number;
  description: string;
  date: string;
  userId: string;
}

export interface CashCount {
  id: string;
  date: string;
  notes: {
    [key: string]: number; // denominação da nota/moeda e quantidade
  };
  total: number;
  userId: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
}

export interface DailyReport {
  id: string;
  date: string;
  entries: number;
  exits: number;
  balance: number;
  cashCount?: CashCount;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface FinanceContextType {
  transactions: Transaction[];
  cashCounts: CashCount[];
  categories: ExpenseCategory[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  saveCashCount: (cashCount: Omit<CashCount, 'id' | 'userId'>) => void;
  addCategory: (category: Omit<ExpenseCategory, 'id' | 'userId'>) => void;
  updateCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;
}
