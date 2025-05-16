const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const {sort} =req.query;
    let query='SELECT * FROM tasks'
    if(sort=="due_date"){
      query += ' ORDER BY due_date ASC';
    }
    const [tasks] = await pool.query(query);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    res.json({ id: result.insertId, title, description, completed: false, reminder_date: null });
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, reminder_date } = req.body;
  try {
    const updates = {};
    if (completed !== undefined) updates.completed = completed;
    if (reminder_date !== undefined) updates.reminder_date = reminder_date || null;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    if (fields) {
      await pool.query(`UPDATE tasks SET ${fields} WHERE id = ?`, [...values, id]);
      res.json({ message: 'Task updated' });
    } else {
      res.status(400).json({ error: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;