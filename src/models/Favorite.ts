import ProductSchema from "./Schemas/ProductSchema";

// Definir el modelo de datos Favorites
class Favorite {
    id?: number; // ID del favorito (opcional, ya que se generará automáticamente en la base de datos)
    user_id: number; // ID del usuario que dio like al producto
    product_data: typeof ProductSchema; // Datos del producto de Shopify

    constructor(user_id: number, product_data: typeof ProductSchema) {
        this.user_id = user_id;
        this.product_data = product_data;
    }
}

export default Favorite;