import { Db } from "mongodb";
import Chatroom from "./chatroom.interface";

export class ChatroomService {
    private db: Db

    constructor(db: Db) {
        this.db = db
    }

    async getAllChatrooms(user: string) {
        const chatrooms = await this.db.collection<Chatroom>("chatrooms").find({
            "users": { $in: [user] }
        }).toArray()
        return chatrooms
    }

    async createChatroom(username: string, name: string) {
        // When someone creates a chatroom, it will have one member
        const newChatroom = {
            name: name,
            totalMembers: 1,
            users: [username]
        }
        const savedChatroom = await this.db.collection<Chatroom>("chatrooms").insertOne(newChatroom)

        return savedChatroom
    }

    async findChatroom(chatroomName: string) {
        const room = await this.db.collection<Chatroom>("chatrooms").findOne({ chatroomName })
        return room
    }
}