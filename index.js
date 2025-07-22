const path = require("path");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

//Conectar a la base de datos
dbConnection();

//Crear el servidor de express
const app = express();

//CORS
app.use(cors());

//Directorio público
app.use(express.static("public"));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Escuchar peticiones (no usar el 3000)
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
