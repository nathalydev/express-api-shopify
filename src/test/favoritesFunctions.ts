// favoriteFunctions.test.ts

import {
    PoolClient,
    QueryResult
} from 'pg';
import {
    Response
} from 'express';
import ProductSchema from '../models/Schemas/ProductSchema';
import {
    addFavorite,
    deleteFavorite,
    getUserFavorites
} from '../controllers/Favorite'; // Make sure to use correct route
import {
    performDatabaseOperation
} from '../config/db';
import {
    jest
} from '@jest/globals';
import {
    beforeEach
} from 'node:test';

jest.mock('../config/db');

describe('Favorite Functions', () => {
    let mockClient: PoolClient;
    let mockResponse: Response;

    beforeEach(() => {
        mockClient = {
            query: jest.fn() as jest.Mock,
        }
        as unknown as PoolClient;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        as unknown as Response;

        (mockClient.query as jest.Mock).mockResolvedValueOnce({
            rows: []
        });

        (performDatabaseOperation as jest.Mock).mockImplementation((callback) => callback(mockClient));
    });

    describe('addFavorite', () => {
        it('should add a favorite successfully', async () => {
            const user_id = 1;
            const product_data = /* provide a valid ProductSchema */ ;
            mockClient.query.mockResolvedValueOnce({
                rows: []
            });

            const response = await addFavorite(user_id, product_data, mockResponse);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                message: 'Favorite added successfully'
            });
        });

        it('should handle errors when adding a favorite', async () => {
            const user_id = 1;
            const product_data = /* provide a valid ProductSchema */ ;
            mockClient.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await addFavorite(user_id, product_data, mockResponse);

            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({
                error: 'Internal server error'
            });
        });
    });

    // Write similar tests for deleteFavorite and getUserFavorites
});