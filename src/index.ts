import express from 'express';
import {performDatabaseOperation} from './config/db';
import { checkFavoritesTable } from './controllers/Check';
import Favorites from "./routes/Favorites";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 4000;

app.use(Favorites);


// Función de prueba para verificar la conexión a la base de datos y la existencia de tablas
async function testDatabaseConnection(): Promise<void> {
  try {
    // Realizar una operación simple para verificar la conexión
    await performDatabaseOperation(async (client) => {
      const result = await client.query('SELECT $1::text as message', ['Database connected successfully']);
      console.log(result.rows[0].message);
    });

    // Verificar la existencia de una tabla de prueba (puedes adaptar esto a tus tablas reales)
    await performDatabaseOperation(async (client) => {
      const query = 'SELECT * FROM information_schema.tables WHERE table_name = $1';
      const params = ['favorite'];
      const result = await client.query(query, params);
      if (result.rows.length > 0) {
        console.log('La tabla existe en la base de datos');
      } else {
        console.log('La tabla NO existe en la base de datos');
      }
    });
  } catch (err) {
    console.error('Error al verificar la conexión a la base de datos y la existencia de tablas:', err);
    // Puedes manejar cualquier error aquí
  }
}

// Endpoint para realizar la prueba de conexión a la base de datos y existencia de tablas
app.get('/test', async (req, res) => {
  try {
    // Ejecutar la función de prueba para verificar la conexión a la base de datos y la existencia de tablas
    await testDatabaseConnection();
    res.json({ message: 'Prueba de conexión a base de datos y tablas realizada con éxito' });
  } catch (err) {
    console.error('Error en la prueba de conexión a base de datos y tablas', err);
    res.status(500).json({ error: 'Error en la prueba de conexión a base de datos y tablas' });
  }
});

app.listen(port, () => {
    checkFavoritesTable()
    console.log(`Server running on port ${port}`);
});
