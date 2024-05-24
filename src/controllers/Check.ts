import {
  PoolClient
} from 'pg';
import {
  performDatabaseOperation
} from '../config/db';

/**
 * @openapi
 * 
 * /favorites/checkTable:
 *  get:
 *    summary: Check if the favorites table exists
 *    description: Verify the existence of the 'favorites' table in the database
 *    responses:
 *      '200':
 *        description: Table existence checked successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Confirmation message that the table exists or has been created
 *      '500':
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message if an issue occurred during table verification or creation
 */
async function checkFavoritesTable(): Promise < void > {
  return performDatabaseOperation(async (client: PoolClient) => {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'favorites'
      );
    `);

    if (!result.rows[0].exists) {
      // If fav table doesn't exist, create it
      await client.query(`
        CREATE TABLE favorites (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          product_data JSONB
        );
      `);
      console.log('Fav table created successfully.');
    }
  }).catch((error) => {
    console.error('Verify/creation error on fav table', error);
  });
}

export {
  checkFavoritesTable
}