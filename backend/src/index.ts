import express, { Request, Response } from 'express';
import {z} from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { UserModel } from './db';

const app = express();
app.use(express.json())

const signupSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

type SignupInput = z.infer<typeof signupSchema>;

app.post("/api/v1/signup",async(req: Request, res: Response<any>): Promise<any> => {
    try {
        // Validate the input data using the Zod schema
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: parsed.error.errors
            });
        }

        const { username, email, password }: SignupInput = parsed.data;

        // Check if a user with the same username already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this username"
            });
        }

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await UserModel.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User signed up successfully"
        });
    } catch (error) {
        console.error("Error during signup:", error);

        // Handle unexpected server errors
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post("/api/v1/signin", (req, res) => {
    
})

app.post("/api/v1/content", (req, res) => {
    
})

app.get("/api/v1/content", (req, res) => {
    
})

app.delete("/api/v1/content", (req, res) => {
    
})

app.post("/api/v1/brain/share", (req, res) => {
    
})

app.post("/api/v1/brain/:shareLink", (req, res) => {
    
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
