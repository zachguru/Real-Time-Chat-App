import { Router, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { Db } from "mongodb";

export class AuthModule {
    public authRouter: Router
    private authController: AuthController

    constructor(db: Db) {
        this.authRouter = Router()
        this.authController = new AuthController(db)
        this.generateRoutes()
    }

    private generateRoutes(): void {
        this.authRouter.post("/register", async (req: Request, res: Response) => {
            const newAuth = await this.authController.registerUser(req.body)
            res.send(newAuth)
        })

        this.authRouter.post("/login", async (req: Request, res: Response) => {
            const loggedUser = await this.authController.login(req.body)
            res.send(loggedUser)
        })
    }
}