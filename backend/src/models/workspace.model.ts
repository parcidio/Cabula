import mongoose, { Document, Schema } from 'mongoose';
import { generateInviteCode } from '../utils/uuid';

export interface WorkspaceDocument extends Document {
    name: string;
    owner: mongoose.Types.ObjectId;
    description: string;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>({
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: false },
    inviteCode: { type: String,
        required: true,
        unique: true,
         default: generateInviteCode },
}, {
    timestamps: true,
});

workspaceSchema.methods.resetInviteCode = function (){
    this.inviteCode = generateInviteCode();
}

const WorkspaceModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
export default WorkspaceModel;