import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceService, getAllWorkspacesUserIsAMemberService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkSpaceMembersService, updateWorkspaceByIdService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { PermissionEnum } from "../enums/role.enum";
import { roleGuard } from "../utils/roleGuard";

export const createNewWorkspaceController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createWorkspaceSchema.parse(req.body);
        const userId = req.user?._id;

        const { workspace } = await createWorkspaceService(userId, body);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "Workspace created successfully",
            workspace
        });
    });

export const getAllWorkspacesUserIsAMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const workspaces = await getAllWorkspacesUserIsAMemberService(userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "User Workspaces retrieved successfully",
            workspaces
        });
    }
);

export const getWorkspaceByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.id);

        await getMemberRoleInWorkspace(userId, workspaceId);

        const {workspace} = await getWorkspaceByIdService( workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace retrieved successfully",
            workspace
        });
    }
);

export const getWorkspaceMembersController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.id);

        const {role} = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [PermissionEnum.VIEW_ONLY]);

        const { members, roles } = await getWorkSpaceMembersService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message: "Workspace members retrieved successfully",
            members,
            roles
        });
    }
);

export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [PermissionEnum.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace analytics retrieved successfully",
      analytics,
    });
  }
);

export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [PermissionEnum.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Member Role changed successfully",
      member,
    });
  }
);

export const updateWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [PermissionEnum.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace updated successfully",
      workspace,
    });
  }
);

export const deleteWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [PermissionEnum.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace deleted successfully",
      currentWorkspace,
    });
  }
);
