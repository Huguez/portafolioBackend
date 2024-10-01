const { Schema, model } = require("mongoose")

const UserSchema = Schema( {
   username: {
      type: Schema.Types.String,
      required: true,
   },
   email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
   }, 
   password: {
      type: Schema.Types.String,
      required: true,
   }
}, {
   timestamps: true
} )

UserSchema.method( "toJSON", function( doc, ret ){
   const { __v, _id, password, ...obj } = this.toObject()
   obj.uid = _id
   return obj
} )

module.exports = model( "User", UserSchema )