const express = require("express")
const cors = require("cors")
const path = require('path')
const connectDB = require("../db/config")

const authRoute = require("../routes/auth")
const articleRoute = require("../routes/article")
const notFound = require("../middleware/notFound")

class Server {

   constructor() {
      this.port = process.env.PORT
      this.app = express()

      this.#middleware()

      this.#routes()
   }

   #middleware(){
      
      this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );
      
      this.app.use( express.json() )
    
      this.app.use( cors() )
   }

   #routes(){
      this.app.use( "/auth", authRoute )

      this.app.use( '/articles', articleRoute )

      this.app.use( "/*", notFound )
   }


   start(){
      try {
         connectDB( () => {
            this.app.listen( this.port, () => console.log( `Server running on http://localhost:${ this.port }/` ) )
         } )
      } catch ( error ) {
         console.log( error );      
      }
   }
}

module.exports = Server 