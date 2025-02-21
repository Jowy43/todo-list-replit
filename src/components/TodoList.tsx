
import React from 'react';
import { Todo } from '../types/todo';

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete }) => (
  <ul className="todo-list">
    {todos.map(todo => (
      <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
        <button 
          onClick={() => onDelete(todo.id)}
          className="delete-button"
        >
          ×
        </button>
      </li>
    ))}
  </ul>
);
