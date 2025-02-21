import React, { useState, useEffect } from 'react';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { getStatistics, groupTodosByDay, sortDays } from './utils/todoUtils';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, checkReminders } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const today = new Date().toISOString().split('T')[0];
  const [selectedDay, setSelectedDay] = useState<string>(
    sortDays(Object.keys(groupTodosByDay(todos)))[0] || today
  );
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;
  const categories = ['work', 'personal', 'shopping', 'health'];

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  useEffect(() => {
    const sortedDays = sortDays(Object.keys(todosByDay));
    if (sortedDays.length > 0) {
      setSelectedDay(sortedDays[0]);
    } else {
      setSelectedDay(today);
    }
  }, [todos]);

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const todosByDay = groupTodosByDay(filteredTodos);
  const sortedDays = sortDays(Object.keys(todosByDay));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const today = new Date().toISOString().split('T')[0];
      addTodo({
        text: inputValue,
        completed: false,
        date: today,
        category: selectedCategory === 'all' ? 'personal' : selectedCategory,
        priority: 'medium',
        dueDate: today
      });
      setInputValue('');
      setSelectedDay(today);
    }
  };

  const stats = getStatistics(todos);

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

        <div className="stats-container">
          <div className="stat-item">Total: {stats.total}</div>
          <div className="stat-item">Completed: {stats.completed}</div>
          <div className="stat-item">Pending: {stats.pending}</div>
          <div className="stat-item">Overdue: {stats.overdue}</div>
        </div>

        <div className="filters">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search todos..."
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <div className="date-pagination">
          {sortedDays.slice(0, 14).map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`date-button ${selectedDay === day ? 'active' : ''}`}
            >
              {new Date(day).toLocaleDateString('en-US', { day: 'numeric' })}
            </button>
          ))}
        </div>

        <div className="todos-container">
          <TodoList
            todos={todosByDay[selectedDay]?.slice(
              (currentPage - 1) * todosPerPage,
              currentPage * todosPerPage
            ) || []}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />

          {todosByDay[selectedDay] && todosByDay[selectedDay].length > todosPerPage && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {Math.ceil(todosByDay[selectedDay].length / todosPerPage)}
              </span>
              <button 
                onClick={() => setCurrentPage(p => 
                  Math.min(Math.ceil(todosByDay[selectedDay].length / todosPerPage), p + 1)
                )}
                disabled={currentPage >= Math.ceil(todosByDay[selectedDay].length / todosPerPage)}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;