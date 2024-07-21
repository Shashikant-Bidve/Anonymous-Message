import {z} from 'zod';

export const usernameValidation = z
            .string()
            .min(2, "Username must be atleast 2 characters long")
            .max(20, "Username must be less than 20 characters");

export const signUpSchema =  z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(4,{message: "Password must be atleast 4 characters"})
})