
import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types/todo';

const STORAGE_KEY = 'todo-app-data';
const MAX_DAYS = 14;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
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
