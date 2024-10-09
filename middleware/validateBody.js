
const validateBody = async ( body ) => {
   
   if( body.length < 1 ){
      throw new Error( "Body is empty" )
   }
   
   for (let i = 0; i < body.length; i++) {
      const { type, content } = body[i];

      const tipos = [ "texto", "imagenes", "code", "lista" ]

      if( !tipos.includes( type ) ){
         throw new Error( "Body is invalid" )
      }

      if( content.length < 1 ){
         throw new Error( "content empty!!" )
      }

      content.forEach( row => {
         if ( typeof row !== "string" ) {
            throw new Error( "row is invalid" )
         }

         if ( row === "" ) {
            throw new Error( "row empty !!!" )
         }
      } );
   }
}

module.exports = validateBody