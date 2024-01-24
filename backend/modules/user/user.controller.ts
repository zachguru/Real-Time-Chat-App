import { Db } from "mongodb";
import { UserService } from "./user.service";
import { ChatroomService } from "../chatroom/chatroom.service";

export class UserController {
    private userService: UserService
    private chatroomService: ChatroomService

    constructor(db: Db) {
        this.userService = new UserService(db)
        this.chatroomService = new ChatroomService(db)
    }

    async getAllUsers() {
        return await this.userService.getAllUsers()
    }

    async createChatroom(username: string, chatroomName: string) {
        const chatroom = await this.chatroomService.createChatroom(username, chatroomName)
        return chatroom
    }

    async getAllChatrooms(username: string) {
        const chatrooms = await this.chatroomService.getAllChatrooms(username)
        return chatrooms
    }

    async findChatroom(name: string) {
        const chatroom = await this.chatroomService.findChatroom(name)
        return chatroom
    }

}