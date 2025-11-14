import {z} from "zod";

export const emojiSchema = z.string().trim().optional();
export const nameSchema = z.string().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const projectIdSchema = z.string().trim().min(1);

export const createProjectSchema = z.object({
    imoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema,
});

export const updateProjectSchema = z.object({
    imoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema,
});
