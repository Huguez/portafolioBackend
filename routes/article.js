const { Router } = require("express")
const { check, param } = require("express-validator")
const { getAllArticles, getArticleById, createArticle, updateArticle } = require('../controllers/article')
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
   check("title", "Title is required" ).notEmpty(),
   check( "body", "Body is invalid" ).isArray(),
   check( "body", "Body is invalid" ).custom( validateBody ),
   validarCampos,
], createArticle )

router.put( "/:id/updateArticle", [
   check("title", "Title is required" ).notEmpty(),
   check( "body", "Body is invalid" ).isArray(),
   check( "body", "Body is Empty" ).isLength({ min: 1 }),
   validarCampos,
], updateArticle )

module.exports = router



// asuka aka 
// yuki takeuchi
// mina kitano
// haruka aizawa 
// mia nanasawa
// Rae lil black
