const Job = require("../models/Job")

const createJob = async ( req, res ) => {
   try {

      const body = { ...req.body }

      const job = new Job( body )

      await job.save()

      return res.status( 200 ).json({
         ok: true,
         job,
      } )
   } catch( err ) {
      console.log( err );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - createJob controller"
      } )
   }
}

const getAllJobs = async ( req, res ) => {
   try {
      // ToDo: implementar query params
      const jobs = await Job.find({}).sort( { startDate: "asc" } )


      return res.status( 200 ).json({
         ok: true,
         jobs,
      } )
   }catch( err ){
      console.log( err );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getAllJobs controller"
      } )
   }
}

const getJobById = async ( req, res ) => {
   try {
      const { id } = req.params

      const job = await Job.findOne({ _id: id })

      if ( !job ) {
         return res.status( 404 ).json( {
            ok: false,
            msg: `Job with id: ${ id } not found`,
         } )
      }

      return res.status( 200 ).json({
         ok: true,
         job,
      } )
   }catch( err ){
      console.log( err );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getJobById controller"
      } )
   }
}

const updateJob = async ( req, res ) => {
   try {
      const { id } = req.params
      const { ...body } = req.body

      const job = await Job.findOne({ _id: id })

      if ( !job ) {
         return res.status( 404 ).json( {
            ok: false,
            msg: `Job with id: ${ id } not found`,
         } )
      }

      const auxJob = await Job.findOneAndUpdate( { _id: id }, body, {
         returnOriginal: false
      } )

      return res.status( 200 ).json({
         ok: true,
         job: auxJob,
      })
   }catch( err ){
      console.log( err );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - updateJob controller"
      } )
   }
}

const deleteJob = async ( req, res ) => {
   try {
      const { id } = req.params

      const job = await Job.findOne({ _id: id })      

      if ( !job ) {
         return res.status( 404 ).json( {
            ok: false,
            msg: `Job with id: ${ id } not found`,
         } )
      }

      const { deletedCount } = await Job.deleteOne( { _id: id } )
      
      return res.status( 200 ).json({
         ok: true,
         job: { deletedCount  }
      })
   }catch( err ){
      console.log( err );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - deleteJob controller"
      } )
   }
}

module.exports = {
   createJob,
   getAllJobs,
   getJobById,
   updateJob,
   deleteJob,
}