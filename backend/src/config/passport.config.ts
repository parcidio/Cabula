import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService } from "../services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL ,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try{
        const {email, sub: googleId, picture} = profile._json;

        console.log("Google profile:", profile);
        console.log("Google ID:", googleId);

        if(!googleId){
          throw new NotFoundException("Google ID (sub) is missing.");
        }

        // Login or create a new account
        const {user} = await loginOrCreateAccountService({
            provider: ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email ,
        });



        return done(null, user);

      }catch (error) {
        console.error("Error in Google strategy callback:", error);
        return done(error, false);
      }
    }
  ));

passport.serializeUser((user:any, done) => done(null, user));

passport.deserializeUser(async (user:any, done) => done(null, user));
