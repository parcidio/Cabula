import { Router } from "express";
import { changeWorkspaceMemberRoleController, createNewWorkspaceController, deleteWorkspaceByIdController, getAllWorkspacesUserIsAMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController } from "../controllers/workspace.controller";

const workSpaceRouter = Router();

workSpaceRouter.post("/create/new", createNewWorkspaceController);

workSpaceRouter.put("/update/:id", updateWorkspaceByIdController);

workSpaceRouter.put("/change/member/role/:id", changeWorkspaceMemberRoleController);

workSpaceRouter.delete("/delete/:id", deleteWorkspaceByIdController);

workSpaceRouter.get("/all", getAllWorkspacesUserIsAMemberController);

workSpaceRouter.get("/members/:id", getWorkspaceMembersController);

workSpaceRouter.get("/analytics/:id", getWorkspaceAnalyticsController);

workSpaceRouter.get("/:id", getWorkspaceByIdController);


export default workSpaceRouter;