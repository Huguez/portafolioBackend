
const validateBody = async ( value ) => {
   
   const cuerpo = JSON.parse( value )

   if( cuerpo.length < 1 ){
      throw new Error( "Body is empty" )
   }

   for (let i = 0; i < cuerpo.length; i++) {
      const { type, content } = cuerpo[i];

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

   return 
}

module.exports = validateBody