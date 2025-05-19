const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    if (sort === "due_date") {
      query += ' ORDER BY reminder_date ASC';
    }
    const [tasks] = await pool.query(query, [req.user.userId]);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, req.user.userId]
    );
    res.json({ 
      id: result.insertId, 
      title, 
      description, 
      completed: false, 
      reminder_date: null,
      user_id: req.user.userId 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed, reminder_date } = req.body;
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = {};
    if (completed !== undefined) updates.completed = completed;
    if (reminder_date !== undefined) updates.reminder_date = reminder_date || null;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    if (fields) {
      await pool.query(
        `UPDATE tasks SET ${fields} WHERE id = ? AND user_id = ?`,
        [...values, id, req.user.userId]
      );
      res.json({ message: 'Task updated' });
    } else {
      res.status(400).json({ error: 'No updates provided' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.userId]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;