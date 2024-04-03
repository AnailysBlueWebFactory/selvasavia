const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRoutes = require("./routes/usersRoutes");
const callsRoutes = require("./routes/callsRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();

const app = express();
// Configurar middleware CORS
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());

// Configura rutas
app.use("/users", usersRoutes);
app.use("/calls", callsRoutes);
app.use("/projects", projectsRoutes);
app.use("/contact", contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
