import { StatusCodes } from "http-status-codes";

export class UserNotFoundError extends Error {
    errorMessage: string
    statusCode: number;

    constructor() {
        super("User does not exist.")
        this.errorMessage = "User does not exist."
        this.statusCode = StatusCodes.NOT_FOUND

    }
}