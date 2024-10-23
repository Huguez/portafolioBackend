const dotenv = require("dotenv")
const Server = require( "./models/Server" )
dotenv.config()

const server = new Server()

server.start()