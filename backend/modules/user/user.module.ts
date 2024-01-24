import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import { Db } from "mongodb";
import { authenticateToken } from "../../auth/auth.service";

export class UserModule {
    public userRouter: Router
    private userController: UserController

    constructor(db: Db) {
        this.userRouter = Router()
        this.userController = new UserController(db)
        this.generateRoutes()
    }

    private generateRoutes(): void {
        this.userRouter.get("/users", authenticateToken, async (req: Request, res: Response) => {
            const allUsers = await this.userController.getAllUsers()
            res.send(allUsers)
        })
        this.userRouter.get("/chatrooms", authenticateToken, async (req: Request, res: Response) => {
            // Reading user from request
            const user = req.user?.username ?? ""
            const response = await this.userController.getAllChatrooms(user)
            res.send(response)
        })
        this.userRouter.get("/chatrooms/:name", authenticateToken, async (req: Request, res: Response) => {
            const chatroomName = req.params.id
            const response = await this.userController.findChatroom(chatroomName)
            return response
        })
        this.userRouter.post("/create-chatroom", authenticateToken, async (req: Request, res: Response) => {
            const response = await this.userController.createChatroom(req.user!.username, req.body.name)
            res.send(response)
        })
    }
}