// Definir un esquema JSONB para los datos del producto de Shopify
const ProductSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "body_html": { "type": "string" },
        "created_at": { "type": "string", "format": "date-time" },
        "handle": { "type": "string" },
        "id": { "type": "integer" },
        "images": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": { "type": "integer" },
                    "product_id": { "type": "integer" },
                    "position": { "type": "integer" },
                    "created_at": { "type": "string", "format": "date-time" },
                    "updated_at": { "type": "string", "format": "date-time" },
                    "width": { "type": "integer" },
                    "height": { "type": "integer" },
                    "src": { "type": "string" },
                    "variant_ids": { "type": "array" }
                }
            }
        },
        "options": {
            "type": "object",
            "properties": {
                "id": { "type": "integer" },
                "product_id": { "type": "integer" },
                "name": { "type": "string" },
                "position": { "type": "integer" },
                "values": { "type": "array", "items": { "type": "string" } }
            }
        },
        "product_type": { "type": "string" },
        "published_at": { "type": "string", "format": "date-time" },
        "published_scope": { "type": "string" },
        "status": { "type": "string" },
        "tags": { "type": "string" },
        "template_suffix": { "type": "string" },
        "title": { "type": "string" },
        "updated_at": { "type": "string", "format": "date-time" },
        "variants": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "barcode": { "type": "string" },
                    "compare_at_price": { "type": ["number", "null"] },
                    "created_at": { "type": "string", "format": "date-time" },
                }
            }
        },
        "vendor": { "type": "string" }
    },
    "required": ["id", "title", "vendor"]
};


export default ProductSchema;