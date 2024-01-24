import { Db } from "mongodb";
import { AuthService } from "./auth.service";
import User from "../modules/user/user.interface";

export class AuthController {
    private authService: AuthService

    constructor(db: Db) {
        this.authService = new AuthService(db)
    }

    async registerUser(user: User) {
        return await this.authService.register(user)
    }

    async login(user: User) {
        return await this.authService.login(user)
    }
}