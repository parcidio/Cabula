import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import "./config/passport.config"
import passport from "passport";

//import { version } from "os";
import authRoutes from "./routes/auth.route";
//import userRoutes from "./routes/user.route";
//import isAuthenticated from "./middlewares/isAuthenticated.middleware";
//import workspaceRoutes from "./routes/workspace.route";
//import memberRoutes from "./routes/member.route";
//import projectRoutes from "./routes/project.route";
//import taskRoutes from "./routes/task.route";

// Create an Express application that will handle incoming requests and responses
const app = express();
const BASE_PATH = config.BASE_PATH; // Base path for API routes

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
); // Middleware to handle session management using cookies in the browser 

// Initialize passport middleware and session
app.use(passport.initialize());
app.use(passport.session());

// Middleware to handle CORS
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);


// Page routing
app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Welcome to cabula",
      version: "1.0.0",
    });
  })
);

// API routing
app.use(`${BASE_PATH}/auth`, authRoutes);
//app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
//app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
//app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
//app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
//app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check route and server initialization
app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase(); //Start the database connection
  console.log("Database connected successfully");
});