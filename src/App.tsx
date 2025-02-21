
import React, { useState } from 'react';
import './App.css';

interface Todo {
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

const STORAGE_KEY = 'todo-app-data';
const MAX_DAYS = 14;

interface Statistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['work', 'personal', 'shopping', 'health'];
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState<Todo | null>(null);

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

  const exportTasks = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target?.result as string);
          setTodos(prev => [...prev, ...importedTodos]);
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveAsTemplate = (todo: Todo) => {
    setTodos(prev => [...prev, { ...todo, id: Date.now(), template: true }]);
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

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [checkReminders]);
  
  const [todos, setTodos] = useState<Todo[]>([
    { 
      id: 1, 
      text: "Complete project presentation", 
      completed: true, 
      date: new Date().toISOString().split('T')[0],
      category: 'work',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    },
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
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  const getStatistics = (): Statistics => {
    const now = new Date();
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      overdue: todos.filter(t => !t.completed && new Date(t.dueDate) < now).length
    };
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        
        <div className="stats-container">
          <div className="stat-item">Total: {getStatistics().total}</div>
          <div className="stat-item">Completed: {getStatistics().completed}</div>
          <div className="stat-item">Pending: {getStatistics().pending}</div>
          <div className="stat-item">Overdue: {getStatistics().overdue}</div>
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
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        
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

        <select 
          value={selectedDay} 
          onChange={(e) => {
            setSelectedDay(e.target.value);
            setCurrentPage(1);
          }}
          className="day-selector"
        >
          {sortedDays.map(day => (
            <option key={day} value={day}>
              {new Date(day).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </option>
          ))}
        </select>

        <div className="action-buttons">
          <button onClick={exportTasks} className="action-button">Export Tasks</button>
          <label className="action-button">
            Import Tasks
            <input
              type="file"
              accept=".json"
              onChange={importTasks}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="date-pagination">
          {Array.from({ length: Math.min(14, sortedDays.length) }, (_, i) => (
            <button
              key={sortedDays[i]}
              onClick={() => setSelectedDay(sortedDays[i])}
              className={`date-button ${selectedDay === sortedDays[i] ? 'active' : ''}`}
            >
              {new Date(sortedDays[i]).toLocaleDateString('en-US', { day: 'numeric' })}
            </button>
          ))}
        </div>

        <div className="todos-container">
          <ul className="todo-list">
            {todosByDay[selectedDay]?.slice(
              (currentPage - 1) * todosPerPage,
              currentPage * todosPerPage
            ).map(todo => (
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
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(todosByDay[selectedDay].length / todosPerPage), p + 1))}
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
