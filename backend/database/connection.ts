import { Db, MongoClient } from "mongodb"


// Creating static class for establishing DB connection
export class DatabaseConnection {
    private static connection: Db

    private constructor() { }

    public static async getConnection() {
        if (!DatabaseConnection.connection) {
            const uri = process.env.DB || ""
            try {
                DatabaseConnection.connection = new MongoClient(uri, {
                    monitorCommands: true
                }).db("chatapp")
                console.log("Successfuly established connection to database.");
                // Perform database operations here
            } catch (error) {
                console.error("Failed to connect to database:", error);
            }
        }
        return DatabaseConnection.connection
    }

}