const { pool } = require('../config/db');
const { sendReminderEmail } = require('./emailService');

const checkReminders = async () => {
  try {
    const connection = await pool.getConnection();
      
    const [tasks] = await connection.execute(`
      SELECT t.*, u.email 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.reminder_date <= NOW() 
      AND t.reminder_date > DATE_SUB(NOW(), INTERVAL 1 MINUTE)
      AND t.completed = false
    `);

    for (const task of tasks) {
      try {
        await sendReminderEmail(task.email, task.title, task.reminder_date);
        
        await connection.execute(
          'UPDATE tasks SET reminder_date = NULL WHERE id = ?',
          [task.id]
        );
      } catch (error) {
        console.error(`Error processing reminder for task ${task.id}:`, error);
      }
    }

    connection.release();
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

const startReminderChecker = () => {
  setInterval(checkReminders, 60000); //1 min
  console.log('Reminder checker started');
};

module.exports = { startReminderChecker }; 