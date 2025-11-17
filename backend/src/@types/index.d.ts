import { UserDocument } from "../models/user.model";

// Declares a global augmentation for the TypeScript type system
declare global {
    // Augments the `Express` namespace, which is part of the Express.js library
    namespace Express {
        // Extends the `User` interface within the `Express` namespace
        interface User extends UserDocument { 
            // Adds an optional `_id` property to the `User` interface
            // `_id` can be of any type (not recommended; consider using a specific type like `string` or `ObjectId`)
            _id?: any;
        }

        interface Request{
            jwt?: string;            
        }
    }
}