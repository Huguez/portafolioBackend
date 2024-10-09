const { request, responce } = require( "express" );

const Article = require("../models/Article")


const getAllArticles = async ( req = request, res = responce ) => {
   try {

      const articles = await Article.find( {} )

      return res.status( 200 ).json( {
         ok: true,
         articles,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getAllArticles",
      } )
   }   
}

const getArticleById = async ( req = request, res = responce ) => {
   try {
      const { id } = req.params

      const article = await Article.findById( id )

      if( !article ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `The article with id: ${ id } is not found`,
         } )
      }

      return res.status( 200 ).json( {
         ok: true,
         article,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - getArticleById",
      } )
   }
}

const createArticle = async ( req = request, res = responce ) => {
   try {

      const { title, body } = req.body
      
      const article = new Article( { title, body } )

      const newArticle  = await article.save()

      return res.status( 200 ).json( {
         ok: true,
         article: newArticle
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - createArticle",
      } )
   }   
}

const updateArticle = async ( req = request, res = responce ) => {
   try {
      const { id } = req.params
      const { title, body } = req.body

      const article = await Article.findById( id )

      if( !article ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `The article with id: ${ id } is not found`,
         } )
      }

      const updatedArticle = await Article.findOneAndUpdate( { _id: id }, { title, body } )

      return res.status( 200 ).json( {
         ok: true,
         article: updatedArticle,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - updateArticle",
      } )
   }   
}


module.exports = {
   getAllArticles,
   getArticleById,
   createArticle,
   updateArticle,
}