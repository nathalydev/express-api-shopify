import express from 'express';
import {
  performDatabaseOperation
} from './config/db';
import {
  checkFavoritesTable
} from './controllers/Check';
import Favorites from "./routes/Favorites";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


dotenv.config();
const app = express();
const port = 4000;

app.use(Favorites);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Favorites API for Shopify Hydrogen Platform',
    version: '1.0.0',
    description: 'This is a REST API application built with Express for managing favorite products within the Shopify Hydrogen platform. The backend service allows users to save and retrieve their favorite products.',
  },
  servers: [{
      url: 'http://localhost:4000',
      description: 'Development Express Backend Server for managing favorite products',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development Hydrogen Frontend Server for Shopify Hydrogen Platform',
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: ['src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
async function testDatabaseConnection(): Promise < void > {
  try {
    await performDatabaseOperation(async (client) => {
      const result = await client.query('SELECT $1::text as message', ['Database connected successfully']);
      console.log(result.rows[0].message);
    });

    await performDatabaseOperation(async (client) => {
      const query = 'SELECT * FROM information_schema.tables WHERE table_name = $1';
      const params = ['favorite'];
      const result = await client.query(query, params);
      if (result.rows.length > 0) {
        console.log('table exist in DB');
      } else {
        console.log('table does not exist in DB');
      }
    });
  } catch (err) {
    console.error('Error in the test for connection to DB:', err);
  }
}

app.get('/test', async (req, res) => {
  try {
    await testDatabaseConnection();
    res.json({
      message: 'Test connection to DB access'
    });
  } catch (err) {
    console.error('Error in the test for connection to DB', err);
    res.status(500).json({
      error: 'Error in the test for connection to DB'
    });
  }
});

app.listen(port, () => {
  checkFavoritesTable()
  console.log(`Server running on port ${port}`);
});