import { StatusCodes } from "http-status-codes";

export class UserAlreadyExistsError extends Error {
    errorMessage: string
    statusCode: number;

    constructor() {
        super("User with that username already exist.")
        this.errorMessage = "User with that username already exist."
        this.statusCode = StatusCodes.CONFLICT

    }
}