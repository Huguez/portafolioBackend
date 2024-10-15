const { request, response } = require( "express" );
const fs = require("fs")
const { upload, destroy, delete_folder, resources } = require("../helpers/cloudinary")
const Article = require("../models/Article")


const getAllArticles = async ( req = request, res = response ) => {
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

const getArticleById = async ( req = request, res = response ) => {
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

const createArticle = async ( req = request, res = response ) => {
   try {
      const { files } = req
      const { title, body: auxBody } = req.body

      const body = JSON.parse( auxBody )

      const article = new Article( { title, body } )

      await article.save()
      
      const articleID = article._id

      const prom = files.map( async ( img ) => {
         try {
            const bitmap = await fs.readFileSync( img.path )
            const b64 = bitmap.toString('base64'); 
            
            const data = `data:${ img.mimetype };base64,${ b64 }`

            return upload( data, { folder: `portfolio/articles/${ articleID }` } ).then( resp => resp.secure_url )
         } catch ( error ) {
            console.log( error );
            throw new Error("Error - files to Promise map")
         }
      } );

      const uploadedImages = await Promise.all( prom )

      article.body.map( ( item ) => {
         if ( item.type === "imagenes" ) {
            item.content = [ ...uploadedImages ]
         }
         return item
      } )

      await article.save()

      // delete imagenes
      files.forEach( ( { path } ) => {
         fs.unlink( path, ( error ) => {
            if ( error ) {
               throw error
            }
         } )
      } )

      return res.status( 200 ).json( {
         ok: true,
         article,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - createArticle",
      } )
   }   
}

const updateArticle = async ( req = request, res = response ) => {
   try {
      const { id } = req.params
      const { files } = req
      const { title, body: auxBody } = req.body
      const body = JSON.parse( auxBody )

      const article = await Article.findById( id )

      if( !article ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `The article with id: ${ id } is not found`,
         } )
      }

      // ToDo: possible implementation of helpers for these tasks 
      // delete images and folder from cloudinary
      for (let index = 0; index < article.body.length; index++) {
         const { type, content } = article.body[index];
         
         if ( type === "imagenes" ) {  
            for (let i  = 0; i < content.length; i++) {
               const element = content[i].split("/")
               const public_id = element.pop().split(".")[0]
               const { result } = await destroy( `portfolio/articles/${ id }/${ public_id }`)
            
               if ( result !== 'ok' ) {
                  return res.status( 404 ).json( {
                     ok: false,
                     scope: "line (+/-)141",
                     msg: `Images don't found in path: portfolio/articles/${ id }/${ public_id }`
                  } )
               }
            }
         }   
      }
      
      //adding new images to cloudinary
      const articleID = article._id

      const prom = files.map( async ( img ) => {
         try {
            const bitmap = await fs.readFileSync( img.path )
            const b64 = bitmap.toString('base64'); 
            
            const data = `data:${ img.mimetype };base64,${ b64 }`

            return upload( data, { folder: `portfolio/articles/${ articleID }` } ).then( resp => resp.secure_url )
         } catch ( error ) {
            console.log( error );
            throw new Error("Error - files to Promise map")
         }
      } );

      const uploadedImages = await Promise.all( prom )

      article.body.map( ( item, index ) => {
         if ( item.type === "imagenes" ) {
            item.content = [ ...uploadedImages ]
         } else {
            item.subtitle  = ( body[index].subtitle ? body[index].subtitle : "" )
            item.content = [ ...body[index].content ]
         }
         return item
      } )

      article.title = title

      await article.save()

      // delete imagenes
      files.forEach( ( { path } ) => {
         fs.unlink( path, ( error ) => {
            if ( error ) {
               throw error
            }
         } )
      } )

      return res.status( 200 ).json( {
         ok: true,
         article,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - updateArticle",
      } )
   }   
}

const deleteArticleById = async ( req = request, res = response ) =>{
   try {
      const { id } = req.params
      const article = await Article.findById( id )

      if( !article ){
         return res.status( 404 ).json( {
            ok: false,
            scope: "line (+/-)145",
            msg: `The article with id: ${ id } is not found`,
         } )
      }

      for (let index = 0; index < article.body.length; index++) {
         const { type, content } = article.body[index];
         
         if ( type === "imagenes" ) {  
            for (let i  = 0; i < content.length; i++) {
               const element = content[i].split("/")
               const public_id = element.pop().split(".")[0]
               const { result } = await destroy( `portfolio/articles/${ id }/${ public_id }`)
            
               if ( result !== 'ok' ) {
                  return res.status( 404 ).json( {
                     ok: false,
                     scope: "line (+/-)160",
                     msg: `Images don't found in path: portfolio/articles/${ id }/${ public_id }`
                  } )
               }
            }
         }   
      }
      
      const options = { 
         prefix: `portfolio/articles/${ id }`,
         resource_type: "image", 
         type: 'upload', 
      }

      const { resources: listResources } = await resources( options )
      if ( listResources.length > 0 ) {
         return res.status( 400 ).json( {
            ok: false,
            scope: "line (+/-)179",
            msg: `Folder is not empty, path: portfolio/articles/${ id }`
         } )
      }

      const { error } = await delete_folder( `portfolio/articles/${ id }` )
      if( error ){
         return res.status( error.http_code ).json( {
            ok: false,
            scope: "line (+/-)188",
            msg: error.message
         } )
      }

      const { deletedCount } = await Article.deleteOne( { _id: id } )
      
      return res.status( 200 ).json( {
         ok: true,
         article: { deletedCount },
      } )

   } catch( error ) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - deleteArticleById",
      } )
   }
}

module.exports = {
   getAllArticles,
   getArticleById,
   createArticle,
   updateArticle,
   deleteArticleById,
}