import { useState } from 'react';

function TaskItem({ task, updateTask, deleteTask }) {
  const [reminderDate, setReminderDate] = useState(task.reminder_date || '');

  const handleReminderChange = (e) => {
    const date = e.target.value;
    setReminderDate(date);
    updateTask(task.id, { reminder_date: date ? new Date(date).toISOString() : null });
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-gray-600">{task.description}</p>
        )}
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700">Reminder:</label>
          <input
            type="datetime-local"
            value={reminderDate ? new Date(reminderDate).toISOString().slice(0, 16) : ''}
            onChange={handleReminderChange}
            className="ml-2 p-1 border rounded-md"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleToggleComplete}
          className={`px-3 py-1 rounded-md ${
            task.completed ? 'bg-gray-400' : 'bg-green-600'
          } text-white`}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="px-3 py-1 bg-red-600 text-white rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;