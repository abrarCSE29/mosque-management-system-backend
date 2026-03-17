import { type Request, type Response, type NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
         res.status(400).json({ status: 'error', errors: error.format() });
         return;
      }
      next(error);
    }
  };
};