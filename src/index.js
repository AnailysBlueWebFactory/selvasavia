const express = require('express');
const dotenv = require('dotenv');
const usersRoutes = require('./routes/usersRoutes');
const callsRoutes = require('./routes/callsRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Configura rutas
app.use('/users', usersRoutes);

app.use('/calls', callsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
