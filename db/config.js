const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

const cnn = process.env.DB_CNN
const database = process.env.DATABASE

const connectDB = ( callback ) => {
   try {
      mongoose.connect( `${ cnn }/${ database }`, {} ).then( () =>{
         console.log( "DB connected Successfully!!!");
         callback()
      } ).catch( error => {
         console.log( error  );
      } )
   } catch (error) {
      console.log( error );
      throw new Error("Database doesn't connected");
   }
}

module.exports = connectDB