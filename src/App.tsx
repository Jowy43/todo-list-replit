import React, { useState } from 'react';

interface TodoProps {
  id: number;
  text: string;
  completed: boolean;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoProps> = ({ id, text, completed, onToggleComplete, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleToggleComplete = () => {
    onToggleComplete(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEditSave = () => {
    // Implement logic to update todo text
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <input type="checkbox" checked={completed} onChange={handleToggleComplete} />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={handleEditChange}
          onBlur={handleEditSave}
          className="edit-input"
        />
      ) : (
        <span className="todo-text" onClick={handleEditStart}>
          {text}
        </span>
      )}
      <button onClick={handleDelete} className="delete-button">
        Delete
      </button>
    </li>
  );
};

export default TodoItem;import './App.css'

export default function App() {
  return (
    <main>
      React ⚛️ + Vite ⚡ + Replit 🌀
    </main>
  )