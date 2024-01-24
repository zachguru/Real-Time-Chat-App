import { StatusCodes } from "http-status-codes";

export class InvalidPasswordError extends Error {
    errorMessage: string
    statusCode: number;

    constructor() {
        super("Invalid password")
        this.errorMessage = "Invalid password"
        this.statusCode = StatusCodes.UNAUTHORIZED

    }
}