const { Schema, model } = require("mongoose")

const JobSchema = Schema( {
   companyName: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      index: true,
   },
   startDate: {
      type: Schema.Types.Date,
      required: true,
   },
   endDate: {
      type: Schema.Types.Date,
      required: true,
   },
   position: {
      type: Schema.Types.String,
      required: true
   },
   location:{
      type: Schema.Types.String,
      required: true,
   },
   modeWork:{
      type: Schema.Types.String,
      enum: [ "remote", "on-site", "hybrid", "freelance" ],
      required: true,
   },
   description: {
      type: Schema.Types.String,
      required: true,
   }
}, {
   timestamps: true
} )

JobSchema.method( "toJSON", function( doc, ret ){
   const { __v, _id, ...obj } = this.toObject()
   obj.id = _id
   return obj
} )

module.exports = model( "Job", JobSchema )