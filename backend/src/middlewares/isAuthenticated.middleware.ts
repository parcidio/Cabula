import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user._id) {
    // Throw an UnauthorizedException if the user is not authenticated
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next(); // User is authenticated, proceed to the next middleware or route handler (controller)
};

export default isAuthenticated;