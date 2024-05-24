import ProductSchema from "./Schemas/ProductSchema";

class Favorite {
    id ? : number; 
    user_id: number;
    product_data: typeof ProductSchema;

    constructor(user_id: number, product_data: typeof ProductSchema) {
        this.user_id = user_id;
        this.product_data = product_data;
    }
}

export default Favorite;