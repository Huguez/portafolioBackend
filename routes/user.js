
const { Router } = require("express")
const { check } = require("express-validator")

const router = new Router()

const { v4: uuidv4 } = require("uuid")
const multer = require("multer")

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'public/uploads/' )
   },
   filename: function (req, file, cb) {
      const uniqueID = uuidv4()
      const ext = file.originalname.split( "." )[1]
      const newFileName = `${ uniqueID }.${ ext }`
      cb(null, newFileName  )
   }
} )

const upload = multer( { storage } )

const { getAboutMe, updateUser } = require("../controllers/user")
const validarCampos = require("../middleware/validarCampos")
const validarJWT = require("../middleware/validateJWT")

router.get( "/aboutMe",  getAboutMe )

router.put( "/:id/updateUser", [
   upload.single( 'photo' ),
   check( "username", "Username is required" ).isString().notEmpty(),
   check( "description", "Description is required" ).isString().notEmpty(),
   validarJWT,
   validarCampos
], updateUser )


module.exports = router