import { Db, ObjectId } from "mongodb";
import User from "./user.interface";


export class UserService {
    private db: Db

    constructor(db: Db) {
        this.db = db
    }

    async getAllUsers() {
        const result = await this.db.collection<User>("users").find({}, { projection: { password: 0 } }).toArray()
        return result
    }

    async findUser(id: string) {
        const user = await this.db.collection<User>("users").findOne({ _id: new ObjectId(id) })
        return user;
    }

    async updateUser(userId: string, updatedUser: User) {
        const updateUser = (await this.db.collection("users").findOneAndReplace({ _id: new ObjectId(userId) }, updatedUser, { projection: { password: 0 } })).value
        return updateUser
    }

}