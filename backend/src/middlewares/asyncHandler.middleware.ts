/**
 * A middleware function to handle asynchronous controllers in Express.
 * This function wraps an asynchronous controller function and ensures that
 * any errors thrown during its execution are passed to the next middleware
 * in the chain, avoiding the need for repetitive try-catch blocks.
 *
 * @param controller - The asynchronous controller function to be wrapped.
 *                      It should be a function that takes `req`, `res`, and `next`
 *                      as arguments and returns a Promise.
 * @returns A wrapped version of the controller function that handles errors
 *          by passing them to the `next` function.
 *
 * @example
 * ```typescript
 * import { asyncHandler } from './asyncHandler.middleware';
 * import { Request, Response, NextFunction } from 'express';
 *
 * const myAsyncController = async (req: Request, res: Response, next: NextFunction) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * };
 *
 * app.get('/endpoint', asyncHandler(myAsyncController));
 * ```
 */
import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };