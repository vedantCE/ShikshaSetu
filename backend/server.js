const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: `${__dirname}/.env` });

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const tugOfWarRoutes = require('./routes/tugOfWarRoutes');
const tracingRoutes = require('./routes/tracingRoutes');
const supportRoutes = require('./routes/supportRoutes');

const errorHandler = require('./middleware/errorHandler');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', tracingRoutes);
app.use('/students', studentRoutes);
app.use('/tugofwar', tugOfWarRoutes);
app.use('/', supportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ShikshaSetu Backend API' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});