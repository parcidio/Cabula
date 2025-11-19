import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { RoleEnum } from "../enums/role.enum";
import WorkspaceModel from "../models/workspace.model";
import MemberModel from "../models/member.model";
import mongoose, { mongo } from "mongoose";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.model";

// Workspace creation service
export const createWorkspaceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }) => {
  const { name, description } = body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER });
  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const workspace = new WorkspaceModel({
    name: name,
    description: description,
    owner: user._id,
  });

  await workspace.save();

  const member = new MemberModel({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return {
    workspace,
  };
}

// Get all workspaces a user is a member of
export const getAllWorkspacesUserIsAMemberService = async (userId: string) => {
  const membership = await MemberModel.find({ userId }).populate("workspaceId").select("-password").exec();

  // Map the membership to get the workspace details
  const workspaces = membership.map(member => member.workspaceId);
  return workspaces;
};

// Get a workspace by ID
export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById({ _id: workspaceId });
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await MemberModel.find({ workspaceId }).populate("role");

  const workspaceWithMembers = {
    ...workspace.toObject(), members
  }
  return { workspace: workspaceWithMembers };
};

// Get all members of a workspace
export const getWorkSpaceMembersService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Get all members in the workspace
  const members = await MemberModel.find({ workspaceId }).populate("userId", "name email profilePicture -password").populate("role", "name");

  // Get all roles
  const roles = await RoleModel.find({}, { name: 1, _id: 1 }).select("-permission").lean();
  return { members, roles };
};

// Get the workspace analytics
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    dueDate: { $lt: currentDate },
    status: { $ne: TaskStatusEnum.DONE },
  });

  const completedTasks = await TaskModel.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};


// Change a member's role in a workspace
export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }
  const member = await MemberModel.findOne({
    userId: memberId,
    workspaceId: workspaceId,
  });

  if(roleId === "__REMOVE_ROLE__") {
    //Remove the user from the workspace
    if (!member) {
      throw new NotFoundException("Member not found in the workspace");
    }
    await MemberModel.deleteOne({
      userId: memberId,
      workspaceId: workspaceId,
    });
    return { member };
  }

  const role = await RoleModel.findById(roleId);


  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  member.role = role;
  await member.save();

  return {
    member,
  };
};


// Update a workspace by ID
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Update the workspace details
  workspace.name = name || workspace.name;
  workspace.description = description || workspace.description;
  await workspace.save();

  return {
    workspace,
  };
};


// Delete a workspace by ID
export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {

  const session = await mongoose.startSession();
  session.startTransaction(); // this will start a new transaction making it possible that all operations within this block are executed successfully or none at all

  try {
    const workspace = await WorkspaceModel.findById(workspaceId).session(
      session
    );
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    // Check if the user owns the workspace
    if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
      throw new BadRequestException(
        "You are not authorized to delete this workspace"
      );
    }

    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await ProjectModel.deleteMany({ workspace: workspace._id }).session(
      session
    );
    await TaskModel.deleteMany({ workspace: workspace._id }).session(session);

    await MemberModel.deleteMany({
      workspaceId: workspace._id,
    }).session(session);

    // Update the user's currentWorkspace if it matches the deleted workspace
    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await MemberModel.findOne({ userId }).session(
        session
      );
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace
        ? memberWorkspace.workspaceId
        : null;

      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();

    session.endSession();

    return {
      currentWorkspace: user.currentWorkspace,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};