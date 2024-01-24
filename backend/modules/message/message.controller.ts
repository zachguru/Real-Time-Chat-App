import { Db } from "mongodb";
import { MessageService } from "./message.service";
import Message from "./message.interface";

export class MessageController {
    private messageService: MessageService

    constructor(db: Db) {
        this.messageService = new MessageService(db)
    }

    async sendMessage(message: Message) {
        return await this.messageService.sendMessage(message)
    }

    async getRecentMessages(receiver: string) {
        return await this.messageService.getRecentMessages(receiver)
    }
}