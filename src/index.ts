import express from "express";
import cors from "cors";
import { TodoModel, UserModel } from "./db";
import mongoose from "mongoose";
import z from "zod";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
    const requiredBody = z.object({
        username: z.string().min(5).max(25),
        password: z.string().min(5).max(20)
    })
    
    const parseBody = requiredBody.safeParse(req.body);
    
    if(!parseBody.success){
        res.status(401).json({
            message: "Check the credentials"
        })
    }
    
        try{ 
            const { username, password } = req.body;
    
            await UserModel.create({
                username: username,
                password: password
            })
            res.status(200).json({
                message: "Signed up successfully"
            })
        } catch(e){
            res.status(411).json({
                message: "User already exists"
            })
        }
})
    
app.post('/signin', async(req, res) => {
    const requiredBody = z.object({
        username: z.string().min(5).max(25),
        password: z.string().min(5).max(20)
    })

    const parseBody = requiredBody.safeParse(req.body);

    if(!parseBody.success){
        res.status(401).json({
            message: "Check the credentials "
        })
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({
        username, 
        password
    })

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_PASSWORD)

        res.json({
            token: token
        })
    } else{
        res.status(411).json({
            message: "Invalid Credentials"
        })
    }
})


app.post("/todo", userMiddleware, async (req, res) =>{
    const title = req.body.title;
    const description = req.body.description;
    const done = req.body.done;

    await TodoModel.create({
        title,
        description,
        done
    })

    res.status(200).json({
        message: "todo is added"
    })

})

app.get("/todos", userMiddleware, async (req, res) => {
    const userId = req.userId;

    const response = await TodoModel.find({
        userId
    }).populate("userId", "username");

    res.json({
        response
    })
})


async function main(){
    await mongoose.connect("");
    app.listen(3000)
}
main();