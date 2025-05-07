import mongoose, { Document, Schema } from 'mongoose';

export interface ProjectDocument extends Document {
    name: string;
    description: string | null;
    imoji: string;
    createdBy: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    imoji: { type: String, required: true, default: '🗂️', trim: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
}, {
    timestamps: true,
});

const ProjectModel = mongoose.model<ProjectDocument>('Project', projectSchema);
export default ProjectModel;