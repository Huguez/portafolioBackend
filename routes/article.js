const { Router } = require("express")
const { body, check, param } = require("express-validator")
const { v4: uuidv4 } = require("uuid")

const multer = require("multer")

const maxCountPhotos = 15

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

const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticleById } = require('../controllers/article')
const validarCampos = require("../middleware/validarCampos")
const validateJWT = require("../middleware/validateJWT")
const validateBody = require("../middleware/validateBody")

const router = new Router()

router.get( "/", getAllArticles )

router.get( "/:id", [
   param( "id", "ID is invalid" ).isMongoId(),
   validarCampos,
], getArticleById )

router.use( validateJWT );

router.post( "/createArticle", [
   upload.array( 'photos', maxCountPhotos ),
   check( "title", "Title is required" ).isString().notEmpty(),
   check( "body", "Body is required" ).notEmpty(),
   body( "body" ).custom( validateBody ),
   validarCampos,
], createArticle )

router.put( "/:id/updateArticle", [
   upload.array( 'photos', maxCountPhotos ),
   check( "title", "Title is required" ).isString().notEmpty(),
   check( "body", "Body is required" ).notEmpty(),
   body( "body" ).custom( validateBody ),
   validarCampos,
], updateArticle )

router.delete( "/:id/deleteArticle", [
   param( "id", "ID is invalid" ).isMongoId(),
   validarCampos,
], deleteArticleById )

module.exports = router