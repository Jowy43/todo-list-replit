
import React, { useState } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Complete project presentation", completed: true, date: new Date().toISOString().split('T')[0] },
    { id: 2, text: "Review team updates", completed: false, date: new Date().toISOString().split('T')[0] },
    { id: 3, text: "Send weekly report", completed: false, date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 4, text: "Team meeting", completed: true, date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 5, text: "Update documentation", completed: false, date: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
    { id: 6, text: "Code review", completed: true, date: new Date(Date.now() - 259200000).toISOString().split('T')[0] },
    { id: 7, text: "Client presentation", completed: false, date: new Date(Date.now() - 345600000).toISOString().split('T')[0] },
    { id: 8, text: "Project planning", completed: true, date: new Date(Date.now() - 432000000).toISOString().split('T')[0] },
    { id: 9, text: "Budget review", completed: false, date: new Date(Date.now() - 518400000).toISOString().split('T')[0] },
    { id: 10, text: "Strategy meeting", completed: true, date: new Date(Date.now() - 604800000).toISOString().split('T')[0] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [visibleDays, setVisibleDays] = useState(7);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false,
        date: new Date().toISOString().split('T')[0]
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const todosByDay = todos.reduce((acc: { [key: string]: Todo[] }, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {});

  const sortedDays = Object.keys(todosByDay).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const loadMore = () => {
    setVisibleDays(prev => prev + 7);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="container">
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <h1>Todo List</h1>
        
        <form onSubmit={addTodo} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <div className="days-container">
          {sortedDays.slice(0, visibleDays).map(day => (
            <div key={day} className="day-group">
              <h2 className="day-header">
                {new Date(day).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <ul className="todo-list">
                {todosByDay[day].map(todo => (
                  <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span>{todo.text}</span>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-button"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {sortedDays.length > visibleDays && (
          <button onClick={loadMore} className="load-more-button">
            Load More Days
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
