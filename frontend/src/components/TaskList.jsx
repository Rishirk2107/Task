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

  const buttonStyle = {
    border: '1px solid black',
    padding: '5px 10px',
    marginRight: '5px',
    cursor: 'pointer',
    background: 'white',
  };

  return (
    <div>
      {tasks.length === 0 && <p>No tasks available.</p>}
      {tasks.map(task => (
        <div key={task.id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
          <div>
            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </h3>
            {task.description && <p>{task.description}</p>}
            {task.reminder && <p>Reminder: {new Date(task.reminder).toLocaleString()}</p>}
          </div>
          <div>
            <button style={buttonStyle} onClick={() => toggleComplete(task.id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            {!task.completed && (
              <button style={buttonStyle} onClick={() => handleReminderClick(task.id)}>
                Set Reminder
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
                style={{ marginRight: '5px' }}
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
