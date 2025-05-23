const express = require('express');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const { initializeDatabase } = require('./config/db');
const { startReminderChecker } = require('./utils/reminderChecker');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startReminderChecker();
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });