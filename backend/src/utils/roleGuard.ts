import { RolesPermissions } from "./role-permission";
import { PermissionEnumType} from "../enums/role.enum";
import { UnauthorizedException } from "./appError";


export const roleGuard = (role: keyof typeof RolesPermissions, requiredPermissions: PermissionEnumType[]) => {
    const permissions = RolesPermissions[role];

    const hasPermission = requiredPermissions.every(permission => permissions.includes(permission));
    
    if (!hasPermission) {
        throw new UnauthorizedException("You do not have permission to perform this action");
    }   
};
