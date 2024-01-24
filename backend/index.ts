import 'dotenv/config';
import express, { Express } from 'express';
//import { GenerateRoutes, appRouter } from './routes';
//import { DatabaseConnection } from '../core/database/connection';
import bodyParser from 'body-parser';
import { DatabaseConnection } from "./database/connection"
import { GenerateRoutes, appRouter } from './routes';
import { RedisClient } from './redis/client';
import { Request } from "express"
import { Server } from 'socket.io';
import http from "http"
import cors from "cors"
import { handleSocketEvents } from './socket/socket.service';


const app: Express = express()
const port = process.env.PORT || 8000;


async function main() {
    try {
        const dbClient = await DatabaseConnection.getConnection()
        await (await RedisClient.getClient()).connect()
        GenerateRoutes(dbClient)
        app.use(cors<Request>())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        app.use(appRouter)
        const server = http.createServer(app)
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        })
        io.on("connection", (socket) => {
            handleSocketEvents(socket, dbClient)
        });
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (e) {
        console.log(e);
    }
}

main();

