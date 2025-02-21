
import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';

const STORAGE_KEY = 'todo-app-data';
const MAX_DAYS = 14;

const generateExampleData = (): Todo[] => {
  const today = new Date();
  const exampleTodos: Todo[] = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    exampleTodos.push({
      id: Date.now() + i,
      text: `Example task for ${dateStr}`,
      completed: Math.random() > 0.5,
      date: dateStr,
      category: ['work', 'personal', 'shopping', 'health'][Math.floor(Math.random() * 4)],
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      dueDate: dateStr,
      notes: `This is a note for task ${i + 1}`,
      reminder: {
        time: '09:00',
        notified: false
      }
    });
  }
  
  return exampleTodos;
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Only add example data if no data exists
      const exampleData = generateExampleData();
      setTodos(exampleData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exampleData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    cleanupOldTasks();
  }, [todos]);

  const cleanupOldTasks = () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - MAX_DAYS);
    setTodos(prev => prev.filter(todo => new Date(todo.date) >= twoWeeksAgo));
  };

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    setTodos(prev => [...prev, { ...todo, id: Date.now() }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const checkReminders = useCallback(() => {
    todos.forEach(todo => {
      if (todo.reminder && !todo.reminder.notified) {
        const reminderTime = new Date(todo.date + 'T' + todo.reminder.time);
        if (new Date() >= reminderTime) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${todo.text}`);
          }
          setTodos(prev => prev.map(t => 
            t.id === todo.id ? { ...t, reminder: { ...t.reminder!, notified: true }} : t
          ));
        }
      }
    });
  }, [todos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    checkReminders
  };
};
