import {z} from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(5, {message: "Content must be at least of 5 character"})
    .max(300, {message: "Content should be less than 300 characters"})
})