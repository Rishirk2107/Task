import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByDueDate, setSortByDueDate] = useState(false);

  const fetchTasks = async () => {
    try {
      const url = sortByDueDate
        ? 'http://localhost:5000/api/tasks?sort=due_date'
        : 'http://localhost:5000/api/tasks';
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortByDueDate]);

  const addTask = async (task) => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const setReminder = async (id, reminder) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}/reminder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminder }),
      });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, reminder } : task
      ));
    } catch (err) {
      setError('Failed to set reminder');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

   const buttonStyle = {
    border: '1px solid black',
    padding: '5px 10px',
    marginRight: '5px',
    cursor: 'pointer',
    background: 'white',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          style={{ marginRight: '10px' }}
        />
        <button onClick={() => setSortByDueDate(!sortByDueDate)}>
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
          deleteTask={deleteTask}
        />
      </div>
      <div>
        <h2>Completed Tasks</h2>
        <TaskList
          tasks={filteredTasks.filter(task => task.completed)}
          toggleComplete={toggleComplete}
          setReminder={setReminder}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
