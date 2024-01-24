import { RedisClientType, createClient } from "redis";

export class RedisClient {
    private static client: RedisClientType

    private constructor() { }

    public static async getClient() {
        if (!RedisClient.client) {
            try {
                RedisClient.client = createClient({
                    password: `${process.env.REDIS_PASSWORD}`,
                    socket: {
                        host: `${process.env.REDIS_HOST}`,
                        port: parseInt(`${process.env.REDIS_PORT}`)
                    }
                });
                console.log("Successfuly created Redis Client.")
            } catch (error) {
                console.error("Failed to create Redis client:", error);
            }
        }
        return RedisClient.client
    }
}