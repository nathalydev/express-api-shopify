import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import Favorite from '../models/Favorite';
import { performDatabaseOperation } from '../config/db';
import ProductSchema from '../models/Schemas/ProductSchema';

// Modificar la función addFavorite para crear un favorito con los datos del producto y guardarlo en la base de datos
async function addFavorite(user_id: number, product_data: typeof ProductSchema, res: Response): Promise<Response> {
  const favorite = new Favorite(user_id, product_data);

  return performDatabaseOperation(async (client: PoolClient) => {
    await client.query('INSERT INTO favorites (user_id, product_data) VALUES ($1, $2)', [user_id, favorite.product_data]);

    return res.status(200).json({ message: 'Favorito agregado exitosamente' });
  }).catch((err) => {
    console.error('Error al agregar el favorito:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  });
}


// Modificar la función deleteFavorite para validar que el favorito existe y coincida con el ID de usuario y producto
async function deleteFavorite(user_id: number, product_id: number, res: Response): Promise<Response> {
  return performDatabaseOperation(async (client: PoolClient) => {
    // Validar que el favorito existe para el usuario y producto dados
    const favoriteResult = await client.query('SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    if (favoriteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado para el usuario especificado' });
    }

    // Eliminar el favorito si existe
    await client.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
    return res.status(200).json({ message: 'Favorito eliminado exitosamente' });
  }).catch((err) => {
    console.error('Error al eliminar el favorito:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  });
}

// Modificar la función getUserFavorites para obtener favoritos por usuario y validarlos con el ProductSchema
async function getUserFavorites(user_id: number, res: Response): Promise<Response> {
  return performDatabaseOperation(async (client: PoolClient) => {
    const result: QueryResult = await client.query('SELECT * FROM favorites WHERE user_id = $1', [user_id]);
    
    const favorites = result.rows.map((row) => ({
      user_id: row.user_id,
      product_data: row.product_data
    }));
    
    return res.status(200).json(favorites);
  }).catch((err) => {
    console.error('Error al obtener los favoritos del usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  });
}

export { addFavorite, deleteFavorite, getUserFavorites };
