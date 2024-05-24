import {
  PoolClient,
  QueryResult
} from 'pg';
import {
  Response
} from 'express';
import Favorite from '../models/Favorite';
import {
  performDatabaseOperation
} from '../config/db';
import ProductSchema from '../models/Schemas/ProductSchema';

/**@openapi
*info:
*  title: Add Favorite Product API
*  description: Endpoint to add a favorite product for a user
*  version: 1.0.0
*paths:
*  /favorite/add:
*    post:
*      summary: Create a favorite product
*      description: Add a favorite product with the provided data for the specified user
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                user_id:
*                  type: integer
*                  description: The ID of the user adding the favorite
*                product_data:
*                  $ref: '#/components/schemas/ProductSchema'
*      responses:
*        '200':
*          description: Fav added successfully 
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    type: string
*                    description: A success message
*        '500':
*          description: Internal server error
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  error:
*                    type: string
*    components:
*      schemas:
*        ProductSchema:
*          type: object
*          properties:
*            source:
*              type: object
*              description: The source of the product
*            author:
*              type: string
*              description: The author of the product
*            title:
*              type: string
*              description: The title of the product
*            description:
*              type: string
*              description: The description of the product
*            url:
*              type: string
*              description: The URL of the product
*            urlToImage:
*              type: string
*              description: The URL to the image of the product
*            publishedAt:
*              type: string
*              description: The published date of the product
*            content:
*              type: string
*              description: The content of the product
*/
async function addFavorite(user_id: number, product_data: typeof ProductSchema, res: Response): Promise < Response > {
  const favorite = new Favorite(user_id, product_data);

  return performDatabaseOperation(async (client: PoolClient) => {
    await client.query('INSERT INTO favorites (user_id, product_data) VALUES ($1, $2)', [user_id, favorite.product_data]);

    return res.status(200).json({
      message: 'Favorite added successfully'
    });
  }).catch((err) => {
    console.error('Error when adding favorite:', err);
    return res.status(500).json({
      error: 'Internal error in server'
    });
  });
}

/**
 * @openapi
 * 
 * /favorites/delete:
 *   delete:
 *     summary: Delete a favorite product
 *     description: Delete a favorite product for a specific user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product to be deleted as a favorite
 *     responses:
 *       '200':
 *         description: Favorite deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the favorite was deleted
 *       '404':
 *         description: Favorite not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the favorite was not found for the specified user
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating an internal server error occurred during deletion
 */

async function deleteFavorite(user_id: number, product_id: number, res: Response): Promise < Response > {
  return performDatabaseOperation(async (client: PoolClient) => {
    const favoriteResult = await client.query('SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    if (favoriteResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Favorito no encontrado para el usuario especificado'
      });
    }

    await client.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    return res.status(200).json({
      message: 'Favorito eliminado exitosamente'
    });
  }).catch((err) => {
    console.error('Error al eliminar el favorito:', err);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  });
}

/**
 * @openapi
 * 
 * /favorites/getUserFavorites:
 *   get:
 *     summary: Get user favorites
 *     description: Retrieve all favorite products of a specific user
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to retrieve favorites for
 *     responses:
 *       '200':
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     description: The ID of the user
 *                   product_data:
 *                     type: object
 *                     description: The data of the favorite product
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating an internal server error occurred during retrieval
 */

async function getUserFavorites(user_id: number, res: Response): Promise < Response > {
  return performDatabaseOperation(async (client: PoolClient) => {
    const result: QueryResult = await client.query('SELECT * FROM favorites WHERE user_id = $1', [user_id]);

    const favorites = result.rows.map((row) => ({
      user_id: row.user_id,
      product_data: row.product_data
    }));

    return res.status(200).json(favorites);
  }).catch((err) => {
    console.error('Error al obtener los favoritos del usuario:', err);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  });
}

export {
  addFavorite,
  deleteFavorite,
  getUserFavorites
};