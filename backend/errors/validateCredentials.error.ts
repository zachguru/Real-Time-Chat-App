import { StatusCodes } from "http-status-codes";

export class UsernameValidationError extends Error {
    errorMessage: string
    statusCode: number;

    // We don't want messy names and SQL injection
    // That's why we set these character long and whitespace restrictions
    constructor() {
        super("Username must be 5-20 characters long and cannot contain whitespaces.")
        this.errorMessage = "Username must be 5-20 characters characters long and cannot contain whitespaces."
        this.statusCode = StatusCodes.BAD_REQUEST

    }
}

export class PasswordValidationError extends Error {
    errorMessage: string
    statusCode: number;

    constructor() {
        super("Password must be atleast 8 characters long and cannot contain whitespaces.")
        this.errorMessage = "Password must be atleast 8 characters long and cannot contain whitespaces."
        this.statusCode = StatusCodes.BAD_REQUEST

    }
}

