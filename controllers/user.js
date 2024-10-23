const fs = require("fs")
const { upload, destroy } = require("../helpers/cloudinary")

const User = require("../models/User")

const adminEmail = process.env.EMAIL

const getAboutMe = async ( req = request, res = response ) => {
   try {

      const admin = await User.findOne( { email: adminEmail } )

      if( !admin ){
         return res.status( 404 ).json( {
            ok: false,
            msg: "not ADMIN"
         } )   
      }

      return res.status( 200 ).json( {
         ok: true,
         admin,
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getAboutMe controller",
      } )
   }
}

const updateUser = async ( req = request, res = response ) => {
   try {
      const { file } = req
      const { username, description: auxD } = req.body

      const description = auxD.split( "~" )

      const admin = await User.findOne( { email: adminEmail } )

      if( !admin ){
         return res.status( 404 ).json( {
            ok: false,
            msg: "not ADMIN"
         } )   
      }
      
      if ( file ) {

         if ( admin.image ) {
            const aux = admin.image.split("/").pop()
            const public_id = aux.split( "." )[0]
            const { result } = await destroy( `portfolio/aboutMe/${ public_id }`)
               
            if ( result !== 'ok' ) {
               return res.status( 404 ).json( {
                  ok: false,
                  msg: `Images don't found in path: portfolio/aboutMe/${ public_id }`
               } )
            }   
         }

         const bitmap = await fs.readFileSync( file.path )
         const b64 = bitmap.toString('base64'); 
         
         const data = `data:${ file.mimetype };base64,${ b64 }`
         
         const resp  = await upload( data, { folder: `portfolio/aboutMe/` } )

         if ( !resp.secure_url ) {
            return res.status( 500 ).json( {
               ok: false,
               msg: "cloudinary"
            } )
         }

         const { path } = file
         fs.unlink( path, ( error ) => {
            if ( error ) {
               throw error
            }
         } )

         admin.image = resp.secure_url
      }
      
      admin.username = username
      admin.description = description

      await admin.save()

      return res.status( 200 ).json( {
         ok: true,
         admin
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - updateUser controller",
      } )
   }
}


module.exports = {
   getAboutMe,
   updateUser,
}