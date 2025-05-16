const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const { initializeDatabase } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});