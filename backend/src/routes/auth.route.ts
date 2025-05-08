import { Router } from 'express';
import passport from 'passport';
import { config } from '../config/app.config';
import { googleLoginCallback } from '../controllers/auth.controller';

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failed`;
const authRouters = Router();

authRouters.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
authRouters.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: failedUrl
    }),
    googleLoginCallback
);

export default authRouters;