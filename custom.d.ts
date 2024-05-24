import { PoolClient } from 'pg';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      poolClient?: PoolClient;
    }
  }
}
