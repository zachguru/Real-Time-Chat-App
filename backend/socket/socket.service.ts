import { Db } from "mongodb";
import { Socket } from "socket.io";
import Chatroom from "../modules/chatroom/chatroom.interface";
import { RedisClient } from "../redis/client";

export const handleSocketEvents = (socket: Socket, db: Db) => {
    socket.on("send-message", (data) => {
        // Works for now like this but it may need some performance improvement
        checkCounter(data.sender).then(tooManyMessages => {
            if (!tooManyMessages) {
                messageCounter(data.sender)
                socket.broadcast.emit("chat-message", data.sender + ": " + data.context)
                // Have to save messages into the database, but this can be done behind the scenes
                // so no need to send a post request, socket can handle it
                db.collection("messages").insertOne(data)
            }
        })

    });
    // This could have been done with a simple post request, but I am into sockets
    socket.on("chatroom-created", chatroom => {
        const name = chatroom.name
        const user = chatroom.users[0]
        findChatroom(name, db).then(existingChatroom => {
            if (!existingChatroom) {
                db.collection("chatrooms").insertOne(chatroom)
            } else if (!existingChatroom.users?.includes(user)) {
                db.collection("chatrooms").findOneAndUpdate({ name }, {
                    $inc: { totalMembers: 1 },
                    $push: { users: user },
                },)
            }
            socket.broadcast.emit("user-connected", {
                user: user,
                chatroomName: chatroom.name
            })
            socket.emit("refresh-chatrooms", user)
            socket.broadcast.emit("refresh-chatrooms", user)
        })
    })

    socket.on("leaving-chatroom", (data) => {
        findChatroom(data.roomName, db).then(existingChatroom => {
            const name = data.roomName
            db.collection("chatrooms").findOneAndUpdate({ name }, {
                $inc: { totalMembers: -1 },
                $pull: { users: data.user }


            },)
            socket.broadcast.emit("user-disconnected", {
                user: data.user,
                chatroomName: name
            })
            socket.emit("refresh-chatrooms", data.user)
            socket.broadcast.emit("refresh-chatrooms", data.user)
        })
    })
}

const findChatroom = async (name: string, db: Db) => {
    const chatroom = await db.collection<Chatroom>("chatrooms").findOne({ name })
    return chatroom
}
// Storing messages to redis
export const messageCounter = async (key: string): Promise<void> => {
    const client = await RedisClient.getClient()
    await client.multi().incr(key).pExpire(key, 60000).exec();
}

// Checking if user has sent more than 10 messages in last minute
export const checkCounter = async (user: string): Promise<boolean> => {
    const client = await RedisClient.getClient();
    const counter = await client.get(user) ?? "0"
    const messageCount = parseInt(counter)
    return messageCount >= 10
}
