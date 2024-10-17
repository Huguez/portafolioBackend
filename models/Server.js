const express = require("express")
const bodyParser = require('body-parser');
const cors = require("cors")
const path = require('path')
const connectDB = require("../db/config")

const authRoute = require("../routes/auth")
const articleRoute = require("../routes/article")
const jobRoute = require("../routes/job")

const notFound = require("../middleware/notFound")

class Server {

   constructor() {
      this.port = process.env.PORT || 8080
      this.app = express()

      this.#middleware()

      this.#routes()
   }

   #middleware(){
      
      this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );
      
      this.app.use( bodyParser.urlencoded({ extended: false }) )

      this.app.use( bodyParser.json() );

      this.app.use( cors() )
   }

   #routes(){
      this.app.use( "/auth", authRoute )

      this.app.use( '/articles', articleRoute )

      this.app.use( "/jobs", jobRoute )

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