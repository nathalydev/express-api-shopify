import {
  Pool,
  PoolClient
} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function performDatabaseOperation(callback: (client: PoolClient) => Promise < any > ): Promise < any > {
  const client = await pool.connect(); // Obtener un PoolClient de la piscina

  try {
    const result = await callback(client); // Realizar la operación de la base de datos utilizando el PoolClient
    return result;
  } finally {
    client.release(); // Liberar el PoolClient después de usarlo
  }
}

export {
  performDatabaseOperation
};