import { useState, useEffect, useCallback } from "react";
import { Todo } from "../types/todo";
import { ApiService } from "../services/api.service";

const generateExampleData = (): Todo[] => {
  const today = new Date();
  const exampleTodos: Todo[] = [
    {
      id: Date.now(),
      text: "Welcome to your Todo App!",
      completed: false,
      date: today.toISOString().split("T")[0],
      category: "personal",
      priority: "medium",
      dueDate: today.toISOString().split("T")[0],
      notes: "This is an example todo",
      reminder: {
        time: "09:00",
        notified: false,
      },
    }
  ];

  return exampleTodos;
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const data = await ApiService.getTodos();
      setTodos(data || generateExampleData());
    } catch (error) {
      const exampleData = generateExampleData();
      setTodos(exampleData);
      await ApiService.updateTodos(exampleData);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo: Omit<Todo, "id">) => {
    const newTodos = [...todos, { ...todo, id: Date.now() }];
    setTodos(newTodos);
    await ApiService.updateTodos(newTodos);
  };

  const toggleTodo = async (id: number) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    await ApiService.updateTodos(newTodos);
  };

  const deleteTodo = async (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    await ApiService.updateTodos(newTodos);
  };

  const checkReminders = useCallback(() => {
    todos.forEach((todo) => {
      if (todo.reminder && !todo.reminder.notified) {
        const reminderTime = new Date(todo.date + "T" + todo.reminder.time);
        if (new Date() >= reminderTime) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Task Reminder: ${todo.text}`);
          }
          const newTodos = todos.map((t) =>
            t.id === todo.id
              ? { ...t, reminder: { ...t.reminder!, notified: true } }
              : t
          );
          setTodos(newTodos);
          ApiService.updateTodos(newTodos);
        }
      }
    });
  }, [todos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    checkReminders,
  };
};