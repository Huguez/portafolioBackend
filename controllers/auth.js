const { Request, Response } = require( "express" );

const login = async ( req = Request, res = Response ) => {
   try {
      return res.status( 200 ).json( {
         ok: true,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - login",
      } )
   }
}

const register = async ( req = Request, res = Response ) => {
   try {
      return res.status( 200 ).json( {
         ok: true,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - register",
      } )
   }
}

module.exports = {
   login,
   register, 
}