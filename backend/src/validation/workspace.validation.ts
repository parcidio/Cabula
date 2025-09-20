import { z } from "zod";

export const nameSchema = z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters");

export const descriptionSchema = z.string().trim().max(500, "Description must be less than 500 characters").optional();

export const workspaceIdSchema = z.string().trim().min(24, "Workspace Id is required");

export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

export const createWorkspaceSchema = z.object({ name: nameSchema, description: descriptionSchema });
export const updateWorkspaceSchema = z.object({ name: nameSchema, description: descriptionSchema });