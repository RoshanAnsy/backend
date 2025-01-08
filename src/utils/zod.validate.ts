import {z} from "zod";

export const signUpZodSchema=z.object({
    name:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(8),
    conformPassword:z.string().min(8),
})

export const loginZodSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8),
})