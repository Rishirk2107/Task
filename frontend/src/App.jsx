import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from './utils/api';
import './App.css';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByDueDate, setSortByDueDate] = useState(false);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(sortByDueDate);
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, sortByDueDate]);

  const addTask = async (task) => {
    try {
      const newTask = await createTask(task);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await updateTask(id, { completed: !completed });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const setReminder = async (id, reminder) => {
    try {
      await updateTask(id, { reminder_date: reminder });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, reminder_date: reminder } : task
      ));
    } catch (err) {
      setError('Failed to set reminder');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleSortToggle = () => {
    setSortByDueDate(!sortByDueDate);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div>
        {showLogin ? <Login /> : <Signup />}
        <button
          onClick={() => setShowLogin(!showLogin)}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'white',
            fontSize: '14px'
          }}
        >
          {showLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <p>Welcome, {user.username}!</p>
        <button
          onClick={logout}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'white',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        <h1>Task Manager</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            style={{ 
              marginRight: '10px',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={handleSortToggle}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'white',
              fontSize: '14px'
            }}
          >
            {sortByDueDate ? 'Sort by Default' : 'Sort by Due Date'}
          </button>
        </div>
        <TaskForm addTask={addTask} />
        <div>
          <h2>Upcoming Tasks</h2>
          <TaskList
            tasks={filteredTasks.filter(task => !task.completed)}
            toggleComplete={toggleComplete}
            setReminder={setReminder}
            deleteTask={handleDeleteTask}
          />
        </div>
        <div>
          <h2>Completed Tasks</h2>
          <TaskList
            tasks={filteredTasks.filter(task => task.completed)}
            toggleComplete={toggleComplete}
            setReminder={setReminder}
            deleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
