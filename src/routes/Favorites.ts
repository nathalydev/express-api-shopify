import express, { Response, Request } from 'express';
import { addFavorite, deleteFavorite, getUserFavorites } from '../controllers/Favorite';
import Favorite from '../models/Favorite';
import ProductSchema from '../models/Schemas/ProductSchema';

const router = express.Router();

// Ruta para agregar un favorito
router.post('/favorite/add', async (req: Request, res: Response) => {
  try {
    const { userID } = req.query;
    const { product } = req.body;

    // Validar si faltan parámetros en la solicitud
    if (!userID || !product) {
      throw new Error('Se requieren los parámetros user_id y product en la solicitud');
    }

    const new_product: typeof ProductSchema = product;
    const response = await addFavorite(Number(userID), new_product, res);
    return response;
  } catch (error: any) {
    console.error('Error en la solicitud para agregar favorito:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Ruta para eliminar un favorito
router.delete('/favorite/delete', async (req: Request, res: Response) => {
  try {
    const { userID, productID } = req.query

    // Validar si faltan parámetros en la solicitud
    if (!userID || !productID) {
      throw new Error('Se requieren los parámetros userID y productID en la solicitud');
    }

    const response = await deleteFavorite(Number(userID), Number(productID), res);
    return response;
  } catch (error: any) {
    console.error('Error en la solicitud para agregar favorito:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Ruta para obtener los favoritos de un usuario
router.get('/favorites/user/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params

    // Validar si el parámetro user_id está presente
    if (!user_id) {
      throw new Error('Se requiere el parámetro user_id en la solicitud');
    }

    const response = await getUserFavorites(Number(user_id), res);
    return response;
  } catch (error: any) {
    console.error('Error en la solicitud para agregar favorito:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({ error: error.message || 'Error interno del servidor' });
  }
});

export default router;