const { sign, verify } = require("jsonwebtoken");

const generateJWT = ( uid ) => {
   try {
      return new Promise( ( resolve, reject ) => {
         const payload = { uid }
         const secret = process.env.KEY_SECRET

         sign( payload, secret, { expiresIn: 60*60*48 }, ( err, token ) => {
            
            if ( err ) {
               console.log( err );
               reject( err )
            } else {
               resolve( token )
            }

         } )
      } )
   } catch ( error ) {
      console.log( error );
      throw new Error( "Error - generateJWT" )
   }
}

const checkIdByJWT = ( token = "" ) => {
   try {
      if ( token === "" ) {
         return null
      }

      const secret = process.env.SECRET_JWT

      const { uid } = verify( token, secret )

      return uid
   } catch ( error ) {
      console.log( error );
      return null;
   }
}

module.exports = {
   generateJWT,
   checkIdByJWT,
}