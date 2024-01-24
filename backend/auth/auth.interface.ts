interface AuthenticatedUser {
    id: string,
    username: string
    iat: number,
    exp: number
}

export default AuthenticatedUser