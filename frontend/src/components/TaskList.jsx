import { useState } from 'react';

function TaskList({ tasks, toggleComplete, setReminder, deleteTask }) {
  const [reminderTaskId, setReminderTaskId] = useState(null);
  const [reminderDate, setReminderDate] = useState('');

  const handleReminderClick = (id) => {
    setReminderTaskId(id);
  };

  const handleReminderSubmit = (e, id) => {
    e.preventDefault();
    if (reminderDate) {
      setReminder(id, reminderDate);
      setReminderTaskId(null);
      setReminderDate('');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    background: 'white',
    fontSize: '14px',
    marginRight: '5px'
  };

  const taskStyle = {
    border: '1px solid #eee',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '4px',
    backgroundColor: '#fff'
  };

  const reminderStyle = {
    color: '#666',
    fontSize: '14px',
    marginTop: '5px'
  };

  return (
    <div>
      {tasks.length === 0 && <p>No tasks available.</p>}
      {tasks.map(task => (
        <div key={task.id} style={taskStyle}>
          <div>
            <h3 style={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              margin: '0 0 10px 0'
            }}>
              {task.title}
            </h3>
            {task.description && <p style={{ margin: '5px 0' }}>{task.description}</p>}
            {task.reminder_date && (
              <p style={reminderStyle}>
                Reminder: {formatDateTime(task.reminder_date)}
              </p>
            )}
          </div>
          <div style={{ marginTop: '10px' }}>
            <button style={buttonStyle} onClick={() => toggleComplete(task.id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            {!task.completed && (
              <button style={buttonStyle} onClick={() => handleReminderClick(task.id)}>
                {task.reminder_date ? 'Change Reminder' : 'Set Reminder'}
              </button>
            )}
            <button style={buttonStyle} onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
          {reminderTaskId === task.id && (
            <form onSubmit={(e) => handleReminderSubmit(e, task.id)} style={{ marginTop: '10px' }}>
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                style={{ 
                  marginRight: '5px',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <button type="submit" style={buttonStyle}>Save</button>
              <button type="button" onClick={() => setReminderTaskId(null)} style={buttonStyle}>Cancel</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
