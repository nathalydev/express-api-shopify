import { PoolClient } from 'pg';
import { performDatabaseOperation } from '../config/db';

// Función para verificar si la tabla de favoritos ya existe
async function checkFavoritesTable(): Promise<void> {
  return performDatabaseOperation(async (client: PoolClient) => {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'favorites'
      );
    `);

    if (!result.rows[0].exists) {
      // Si la tabla de favoritos no existe, crearla
      await client.query(`
        CREATE TABLE favorites (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          product_data JSONB
        );
      `);
      console.log('Tabla de favoritos creada con éxito.');
    }
  }).catch((error) => {
    console.error('Error al verificar/crear la tabla de favoritos:', error);
  });
}

export { checkFavoritesTable }