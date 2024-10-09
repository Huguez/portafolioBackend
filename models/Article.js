const { Schema, model } = require("mongoose")

const ContentItemSchema = Schema( {
   type: {
      type: Schema.Types.String,
      enum: [ "texto", "imagenes", "code", "lista" ],
      required: true,
   },
   subtitle:{
      type: Schema.Types.String,
      required: false,
      default: "",
   },
   content: {
      type: [ Schema.Types.String ],
      required: true,
   },
} )

const ArticleSchema = Schema( {
   title: {
      type: Schema.Types.String,
      required: true,
   },
   body: {
      type: [ ContentItemSchema ],
      required: true,
   }
} )

ArticleSchema.method( "toJSON", function( doc, ret ){
   const { __v, _id, ...obj } = this.toObject()
   obj.id = _id
   return obj
} )

module.exports = model( "Article", ArticleSchema ) 