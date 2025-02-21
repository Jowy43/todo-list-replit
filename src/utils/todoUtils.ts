
import { Todo, Statistics } from '../types/todo';

export const getStatistics = (todos: Todo[]): Statistics => {
  const now = new Date();
  return {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && new Date(t.dueDate) < now).length
  };
};

export const groupTodosByDay = (todos: Todo[]) => {
  return todos.reduce((acc: { [key: string]: Todo[] }, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {});
};

export const sortDays = (days: string[]) => {
  return days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};
