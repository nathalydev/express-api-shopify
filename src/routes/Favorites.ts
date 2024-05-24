import express, {
  Response,
  Request
} from 'express';
import {
  addFavorite,
  deleteFavorite,
  getUserFavorites
} from '../controllers/Favorite';
import Favorite from '../models/Favorite';
import ProductSchema from '../models/Schemas/ProductSchema';

const router = express.Router();

router.post('/favorite/add', async (req: Request, res: Response) => {
  try {
    const {
      userID
    } = req.query;
    const {
      product
    } = req.body;

    if (!userID || !product) {
      throw new Error('user_id and product are required in this request');
    }

    const new_product: typeof ProductSchema = product;
    const response = await addFavorite(Number(userID), new_product, res);
    return response;
  } catch (error: any) {
    console.error('Error in the request to add favorite:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

router.delete('/favorite/delete', async (req: Request, res: Response) => {
  try {
    const {
      userID,
      productID
    } = req.query

    if (!userID || !productID) {
      throw new Error('The userID and productID parameters are required in the request');
    }

    const response = await deleteFavorite(Number(userID), Number(productID), res);
    return response;
  } catch (error: any) {
    console.error('Error in the request to add favorite:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

router.get('/favorites/user/:user_id', async (req: Request, res: Response) => {
  try {
    const {
      user_id
    } = req.params

    if (!user_id) {
      throw new Error('The user_id parameter is required in the request');
    }

    const response = await getUserFavorites(Number(user_id), res);
    return response;
  } catch (error: any) {
    console.error('Error in the request to add favorite:', error);
    return res.status(error instanceof SyntaxError || error instanceof URIError ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
});

export default router;