import { Db } from "mongodb";
import User from "../modules/user/user.interface";
import { UserAlreadyExistsError } from "../errors/usernameExists.error";
import bcrypt from "bcrypt"
import { UserNotFoundError } from "../errors/userDoesNotExist.error";
import { InvalidPasswordError } from "../errors/invalidPassword.error";
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import AuthenticatedUser from "./auth.interface";
import { PasswordValidationError, UsernameValidationError } from "../errors/validateCredentials.error";
import { WrongTokenOrMissingError } from "../errors/wrongTokenOrMissing.error";
export class AuthService {
    private db: Db

    constructor(db: Db) {
        this.db = db
    }

    async register(userDto: User) {

        const username = userDto.username

        // Validating credentials
        const invalidCredentials = await this.validateCredentials(userDto.username, userDto.password, true)
        if (invalidCredentials instanceof Error) {
            return invalidCredentials
        }

        // Checking if user with given username already exists
        const dbUser = await this.db.collection<User>("users").findOne({ username })
        if (dbUser) {
            return new UserAlreadyExistsError()
        }

        // Hashing password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(userDto.password, saltRounds)
        userDto.password = hashedPassword

        const newUser = {
            ...userDto, chatRooms: []
        }

        // Inserting new entry into database
        const result = await this.db.collection<User>("users").insertOne(newUser)
        return result
    }


    async login(userDto: User) {
        const username = userDto.username

        // Validating credentials
        const invalidCredentials = await this.validateCredentials(userDto.username, userDto.password, false)
        if (invalidCredentials instanceof Error) {
            return invalidCredentials
        }

        // Finding user in database 
        const dbUser = await this.db.collection<User>("users").findOne({ username })

        // Checking if user does not exist
        if (!dbUser) {
            return new UserNotFoundError()
        }

        // Comparing password
        const comparePassword = await bcrypt.compare(userDto.password, dbUser.password)
        if (!comparePassword) {
            return new InvalidPasswordError()
        }

        // Generating token, keeping it max simple
        const token = jwt.sign({ username: username, id: dbUser._id }, `${process.env.SECRET}`, {
            expiresIn: "1h"
        })
        return {
            username: username,
            accessToken: token
        }
    }

    async validateCredentials(username: string, password: string, forRegister: boolean) {
        if (!username || username.length < 5 || username.length > 20 || username.indexOf(' ') > 0) {
            return new UsernameValidationError()
        }
        if (forRegister && (!password || password.length < 8 || password.length > 20 || password.indexOf(' ') > 0)) {
            return new PasswordValidationError()
        }
    }
}

// Middleware to be used for authenticating token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.json(new WrongTokenOrMissingError())
    }

    try {
        const decodedToken = jwt.verify(token, `${process.env.SECRET}`) as AuthenticatedUser;

        // Cheking if token expired
        const expirationTime = decodedToken.exp * 1000

        if (Date.now() > expirationTime) {
            return res.json(new WrongTokenOrMissingError())
        }

        // Saving decoded token (user info) inside request object, so I can access it from every controller
        req.user = decodedToken
        // Enabling next middleware in line
        next();
    } catch (error) {
        return res.json(new WrongTokenOrMissingError())
    }
};