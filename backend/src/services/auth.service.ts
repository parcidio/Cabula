import mongoose, { mongo } from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import { RoleEnum } from "../enums/role.enum";
import RoleModel from "../models/roles-permission.model";
import { NotFoundException } from "../utils/appError";
import MemberModel from "../models/member.model";

export const loginOrCreateAccountService = async (data: {
    provider: string,
    displayName: string,
    providerId: string,
    picture?: string,
    email?: string,
}) => {
    const { provider, displayName, providerId, picture, email } = data;
    console.log("loginOrCreateAccountService called with data:", data);

    // Start a database session for transaction management
    const session = await mongoose.startSession();

    try {
        // Check if the user already exists in the database
        let user = await UserModel.findOne({ email }).session(session);
        if (!user) {
            session.startTransaction();
            console.log("Starting transaction...");

            // Create a new user
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            // Create a new account associated with the user
            const account = new AccountModel({
                user: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });

            // Create a new workspace for the user
            const workspace = new WorkspaceModel({
                name: `My Workspace`,
                description: `Worspace create for ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            //Check if the owner role exists
            const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER }).session(session);
            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }

            // Create a new member with the owner role for the user in the workspace
            const member = new MemberModel({
                user: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });

            await member.save({ session });

            // Make the workspace the user's current workspace
            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });

        }
      
        // Commit all changes in the transaction
        await session.commitTransaction();
        console.log("Transaction committed successfully.");
        return { user: user };
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in loginOrCreateAccountService:", error);
        throw error; // Rethrow the error to be handled by the caller
    } finally {
        session.endSession();
        console.log("Session ended.");
    }

};