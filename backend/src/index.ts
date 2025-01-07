import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {promise, z} from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { Contentmodel, LinkModel, UserModel } from './db';
import { userMiddleware } from "./middleware";
import { random } from './utils';

dotenv.config();

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
        //  Zod schema validation
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: parsed.error.errors
            });
        }

        const { username, email, password }: SignupInput = parsed.data;

        // user with the same username 
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this username"
            });
        }

        // Hash  password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // new user in database
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

        // server errors
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post("/api/v1/signin",async (req:Request , res:Response<any>): Promise<any> => {
    try{
        const{ username, password } = req.body;

        const existingUser = await UserModel.findOne({username});
        if(!existingUser) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        const token = jwt.sign(
            {id: existingUser.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "24h"}
        );

        return res.status(200).json({
            message: "sign-in successful",
            token,
        });
    }catch(error){
        console.error("Error during sign-in: ", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post("/api/v1/content",userMiddleware, async (req: Request, res: Response) => {
    const link = req.body.link;
    const type = req.body.type;
    Contentmodel.create({
        link,
        type,
        userId: req.userId,
        tags: []
    })
     res.json({
        message: "Content added"
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await Contentmodel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId

    await Contentmodel.deleteMany({
        contentId,
        userId: req.userId
    })
    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware, async (req, res) => {
    const share = req.body.share;
    if(share){
    // check if a link already exists
        const existingLink = await LinkModel.findOne({userId: req.userId});
        if(existingLink){
            res.json({hash: existingLink.hash});
            return;
        }
        const hash = random(10);
        await LinkModel.create({userId: req.userId, hash});
        res.json({
            message: "/brain/" + hash
        });
    }else{
        await LinkModel.deleteOne({
            userId: req.userId
        });
    }
    res.json({
        message: "Removed link"
    })
})

app.get("/api/v1/brain/:shareLink", (req, res) => {
    
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});