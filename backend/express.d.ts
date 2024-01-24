import AuthenticatedUser from "./auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser
        }
    }
}