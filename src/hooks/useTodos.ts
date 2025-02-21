
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Todo } from '../types/todo';

const BIN_ID = '65aa1234abcd1234' // You'll need to create a bin at JSONbin.io
const API_KEY = '$2a$10$YOUR_API_KEY' // You'll need to get this from JSONbin.io

const api = axios.create({
  baseURL: 'https://api.jsonbin.io/v3/b',
  headers: {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json',
  }
});

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

  const fetchTodos = async () => {
    try {
      const response = await api.get(`/${BIN_ID}/latest`);
      setTodos(response.data.record || []);
    } catch (error) {
      const exampleData = generateExampleData();
      setTodos(exampleData);
      await api.put(`/${BIN_ID}`, exampleData);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await api.put(`/${BIN_ID}`, newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = async (todo: Omit<Todo, 'id'>) => {
    const newTodos = [...todos, { ...todo, id: Date.now() }];
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const toggleTodo = async (id: number) => {
    const newTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const deleteTodo = async (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    await saveTodos(newTodos);
  };

  const checkReminders = useCallback(() => {
    todos.forEach(todo => {
      if (todo.reminder && !todo.reminder.notified) {
        const reminderTime = new Date(todo.date + 'T' + todo.reminder.time);
        if (new Date() >= reminderTime) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${todo.text}`);
          }
          const newTodos = todos.map(t => 
            t.id === todo.id ? { ...t, reminder: { ...t.reminder!, notified: true }} : t
          );
          setTodos(newTodos);
          saveTodos(newTodos);
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
