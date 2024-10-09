const { request, responce } = require( "express" );
const { verify, TokenExpiredError } = require("jsonwebtoken")

const validateJWT = ( req = request, res = responce, next ) => {
   try {
      const token = req.header( "x-token" )
      if ( !token ) {
         return res.status( 401 ).json( {
            ok: false,
            msg: "There is not token in request"
         } )
      }

      const secret = process.env.KEY_SECRET

      const payload = verify( token, secret )

      req.uid = payload.uid

      return next()
   } catch (error) {
      console.log( error );

      if ( error instanceof TokenExpiredError ) {
         return res.status( 401 ).json( {
            ok: false,
            msg: "Token expired"
         } )
      }

      return res.status( 401 ).json( {
         ok: false,
         msg: "Token isn't valid"
      } )
      
   }
}

module.exports = validateJWT