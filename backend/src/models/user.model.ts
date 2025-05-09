import mongoose, { Document, Schema } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';

export interface UserDocument extends Document {
   
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lasLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null;
    comparePassword(password: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new Schema<UserDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, select: true},
    profilePicture: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lasLogin: { type: Date, default: null },
    currentWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null }
}, {
    timestamps: true,   
});

//Middleware to hash password before (pre) saving user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password) {
        this.password = await hashValue(this.password);
        }
    }
next();
})

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const userObject = this.toObject() as UserDocument;
    delete userObject.password;
    return userObject;
}

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return compareValue(password, this.password);
}

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;