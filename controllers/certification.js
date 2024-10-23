const { request, response } = require( "express" );
const Certification = require("../models/Certification")

const getAllCertifications = async ( req = request, res = response ) => {
   try {

      const certifications = await Certification.find( {} )

      return res.status( 200 ).json( {
         ok: true,
         certifications,
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getAllCertifications controller",
      } )
   }
}

const getCertificationById = async ( req = request, res = response ) => {
   try {
      const { id } = req.params

      const certification = await Certification .findOne( { _id: id } )      

      if( !certification ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `cretification with id: ${ id } is not found`,
         } )
      }

      return res.status( 200 ).json( {
         ok: true,
         certification,
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getCertificationById controller",
      } )
   }
}

const createCertification = async ( req = request, res = response ) => {
   try {
      const body = { ...req.body }

      const certification = new Certification( body )

      await certification.save()

      return res.status( 200 ).json( {
         ok: true,
         certification,
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - createCertification controller",
      } )
   }
}

const updateCertification = async ( req = request, res = response ) => {
   try {
      const { id } = req.params
      const body = { ...req.body }

      const certification = await Certification .findOne( { _id: id } )      

      if( !certification ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `cretification with id: ${ id } is not found`,
         } )
      }

      const auxCer = await Certification.findOneAndUpdate( { _id: id }, body, {
         returnOriginal: false
      } )

      return res.status( 200 ).json( {
         ok: true,
         certification: auxCer,
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - updateCertification controller",
      } )
   }
}

const deleteCertification = async ( req = request, res = response ) => {
   try {
      const { id } = req.params
      
      const certification = await Certification .findOne( { _id: id } )      

      if( !certification ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `cretification with id: ${ id } is not found`,
         } )
      }

      const { deletedCount } = await Certification.deleteOne( { _id: id } )      

      return res.status( 200 ).json( {
         ok: true,
         certification: { deletedCount },
      } )
   } catch ( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - deleteCertification controller",
      } )
   }
}

module.exports = {
   getAllCertifications,
   getCertificationById,
   createCertification,
   updateCertification,
   deleteCertification,
}