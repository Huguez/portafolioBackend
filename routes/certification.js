const { Router } = require("express")
const { param } = require("express-validator")

const router = new Router()

const {  getAllCertifications, getCertificationById, 
      createCertification, updateCertification, 
      deleteCertification } = require("../controllers/certification")

const validarCampos = require("../middleware/validarCampos")
const validateJWT = require("../middleware/validateJWT")


router.get( "/:id", [
   param( "id", "the ID is not valid" ).isMongoId(),
   validarCampos
], getCertificationById )

router.get( "/", getAllCertifications )

router.use( validateJWT )

router.post( "/createCertification", [

], createCertification )

router.put( "/:id/updateCertification", [
   param( "id", "the ID is not valid" ).isMongoId(),
   validarCampos
], updateCertification )

router.delete( "/:id/deleteCertification", [
   param( "id", "the ID isn't valid" ).isMongoId(),
   validarCampos
], deleteCertification )

module.exports = router