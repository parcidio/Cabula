import { Router } from 'express';
import passport from 'passport';
import { config } from '../config/app.config';
import { googleLoginCallback, loginController, logoutController, registerUserController } from '../controllers/auth.controller';
import { log } from 'console';

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failed`;
const authRouters = Router();

// Auth routes
authRouters.post('/register', registerUserController);
authRouters.post('/login',loginController);
authRouters.post('/logout', logoutController);

// Google OAuth routes
authRouters.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }));
    
authRouters.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: failedUrl,
        session: false,
    }),
    googleLoginCallback
);




export default authRouters;