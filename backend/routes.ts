import { Router } from "express";
import { UserModule } from "./modules/user/user.module";
import { Db } from "mongodb";
import { AuthModule } from "./auth/auth.module";
import { MessageModule } from "./modules/message/message.module";

export const appRouter = Router()

export function GenerateRoutes(db: Db) {
    const userModule = new UserModule(db)
    const authModule = new AuthModule(db)
    const messageModule = new MessageModule(db)
    appRouter.use(userModule.userRouter)
    appRouter.use(authModule.authRouter)
    appRouter.use(messageModule.messageRouter)
}