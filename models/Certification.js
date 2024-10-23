const { Schema, model } = require("mongoose")

const CertificationScheme = Schema( {
   imagen: {
      type: Schema.Types.String,
      required: false,
      default: "",
   },
   title: {
      type: Schema.Types.String,
      required: true,
      unique: true,
   },
   link: {
      type: Schema.Types.String,
      required: true,
   }
}, {
   timestamps: true,
} )

CertificationScheme.method( "toJSON", function( doc, ret ){
   const { __v, _id, ...obj } = this.toObject()
   obj.id = _id
   return obj
} )

module.exports = model( "Certification", CertificationScheme )