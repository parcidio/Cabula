import { PermissionEnum, PermissionEnumType, RoleEnum, RoleEnumType } from "../enums/role.enum";

export const RolesPermissions: Record<RoleEnumType, Array<PermissionEnumType>> = {
    OWNER: [
        PermissionEnum.CREATE_WORKSPACE,
        PermissionEnum.DELETE_WORKSPACE,
        PermissionEnum.EDIT_WORKSPACE,
        PermissionEnum.MANAGE_WORKSPACE_SETTINGS,

        PermissionEnum.ADD_MEMBER,
        PermissionEnum.CHANGE_MEMBER_ROLE,
        PermissionEnum.REMOVE_MEMBER,

        PermissionEnum.CREATE_PROJECT,
        PermissionEnum.DELETE_PROJECT,
        PermissionEnum.EDIT_PROJECT,

        PermissionEnum.CREATE_TASK,
        PermissionEnum.DELETE_TASK,
        PermissionEnum.EDIT_TASK,

        PermissionEnum.VIEW_ONLY,
    ],

    ADMIN: [
        PermissionEnum.ADD_MEMBER,

        PermissionEnum.MANAGE_WORKSPACE_SETTINGS,

        PermissionEnum.CREATE_PROJECT,
        PermissionEnum.DELETE_PROJECT,
        PermissionEnum.EDIT_PROJECT,

        PermissionEnum.CREATE_TASK,
        PermissionEnum.DELETE_TASK,
        PermissionEnum.EDIT_TASK,

        PermissionEnum.VIEW_ONLY,
    ],

    MEMBER: [
        PermissionEnum.CREATE_TASK,
        PermissionEnum.EDIT_TASK,
        PermissionEnum.DELETE_TASK,

        PermissionEnum.VIEW_ONLY,
    ],
    GUEST: [
        PermissionEnum.VIEW_ONLY,
    ],
}