
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  notes?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly' | null;
  template?: boolean;
  reminder?: {
    time: string;
    notified: boolean;
  };
}

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}
