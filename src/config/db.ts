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
  const client = await pool.connect(); // Get a PoolClient from pool

  try {
    const result = await callback(client); // Start BD operation using PoolClient 
    return result;
  } finally {
    client.release(); // Release PoolClient after using it.
  }
}

export {
  performDatabaseOperation
};