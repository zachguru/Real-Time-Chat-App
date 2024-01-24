import { Router, Request, Response } from "express";
import { MessageController } from "./message.controller";
import { Db } from "mongodb";

export class MessageModule {
    public messageRouter: Router
    private messageController: MessageController

    constructor(db: Db) {
        this.messageRouter = Router()
        this.messageController = new MessageController(db)
        this.generateRoutes()
    }

    private generateRoutes(): void {
        this.messageRouter.post("/message", async (req: Request, res: Response) => {
            const newMessage = await this.messageController.sendMessage(req.body)
            res.send(newMessage)
        })
        this.messageRouter.get("/recent/:id", async (req: Request, res: Response) => {
            const receiver = req.params.id
            const recentMessages = await this.messageController.getRecentMessages(receiver)
            res.send(recentMessages)
        })
    }
}