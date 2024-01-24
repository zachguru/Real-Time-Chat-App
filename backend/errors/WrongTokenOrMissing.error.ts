import { StatusCodes } from "http-status-codes";

export class WrongTokenOrMissingError extends Error {
    errorMessage: string
    statusCode: number;

    constructor() {
        super("Invalid token")
        this.errorMessage = "Invalid token"
        this.statusCode = StatusCodes.UNAUTHORIZED

    }
}