import { string, z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

export const titleSchema = z.string().min(1).max(255);
export const description = z.string().trim().optional();
export const prioritySchema = z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]]);
export const statusSchema = z.enum(Object.values(TaskStatusEnum) as [string, ...string[]]);
export const assigneeSchema = z.string().trim().min(1).nullable().optional();
export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const taskIdSchema = z.string().trim().min(1);

export const createTaskSchema = z.object({
  title: titleSchema,
  description: description,
  status: statusSchema,
  priority: prioritySchema,
  assignee: assigneeSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
title: titleSchema,
  description: description,
  status: statusSchema,
  priority: prioritySchema,
  assignee: assigneeSchema,
  dueDate: dueDateSchema,


});
