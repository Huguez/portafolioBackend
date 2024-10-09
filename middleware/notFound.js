
const notFound = async ( req = request, res = responce ) => {
   try {
      return res.status( 404 ).json( {
         ok: false,
         msg: "endpoint not found !!!!"
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - notFound",
      } )
   }
}

module.exports = notFound