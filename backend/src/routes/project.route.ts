import {Router} from  "express"
import { createProjectController, deleteProjectController, getAllProjectsInWorkspaceController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController, updateProjectController } from "../controllers/project.controller";

const ProjectRoutes = Router()

ProjectRoutes.post("/workspace/:workspaceId/create", createProjectController);

ProjectRoutes.put(
  "/:id/workspace/:workspaceId/update",
  updateProjectController
);

ProjectRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteProjectController
);

ProjectRoutes.get(
  "/workspace/:workspaceId/all",
  getAllProjectsInWorkspaceController
);

ProjectRoutes.get(
  "/:id/workspace/:workspaceId/analytics",
  getProjectAnalyticsController
);

ProjectRoutes.get(
  "/:id/workspace/:workspaceId",
  getProjectByIdAndWorkspaceIdController
);

export default ProjectRoutes
