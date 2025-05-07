import mongoose, { Document, Schema } from 'mongoose';
import { PermissionEnum, PermissionEnumType, RoleEnum, RoleEnumType } from '../enums/role.enum';
import { RolesPermissions } from '../utils/role-permission';
import { time } from 'console';

export interface RoleDocument extends Document {
    name: string;
    permissions: Array<PermissionEnumType>;
}

const roleSchema = new Schema<RoleDocument>({
    name: { type: String, required: true, unique: true, enum: Object.values(RoleEnum) },
    permissions: {
        type: [String], required: true, enum: Object.values(PermissionEnum), default: function (this: RoleDocument) {
            return RolesPermissions[this.name as RoleEnumType];
        }
    },
}, {
    timestamps: true,
});

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema);
export default RoleModel;