const { Request, Response } = require( "express" );
const bcrytpjs = require("bcryptjs")
const User = require("../models/User")
const { generateJWT } = require("../helpers/jwt")

const salt = bcrytpjs.genSaltSync()

const login = async ( req = Request, res = Response ) => {
   try {
      const { email, password } = req.body

      const user = await User.findOne( { email } )
      if( !user ){
         return res.status( 404 ).json( {
            ok: false,
            msg: `E-mail ${ email } is NOT registered`
         } )
      }

      const samePwd =  bcrytpjs.compareSync( password, user.password )
      if ( !samePwd ){
         return res.status( 400 ).json( {
            ok: false,
            msg: `Incorrect password`,
         } )
      }

      const token = await generateJWT( user.uid )

      return res.status( 200 ).json( {
         ok: true,
         token,
         user
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - login",
      } )
   }
}

const register = async ( req = Request, res = Response ) => {
   try {
      const { username, password, email } = req.body

      const thereIsUser = await User.findOne( { email } )
      if( thereIsUser ){
         return res.status( 400 ).json( {
            ok: false,
            msg: `E-mail ${ email } is already registered`
         } )
      }

      const newUser = new User( { username, password, email } )

      newUser.password = bcrytpjs.hashSync( password, salt )

      const user = await newUser.save()

      const token = await generateJWT( user.uid )

      return res.status( 200 ).json( {
         ok: true,
         token,
         user,
      } )
   } catch (error) {
      console.log( error );
      return res.status( 500 ).json( {
         ok: false,
         msg: "Error - register",
      } )
   }
}

module.exports = {
   login,
   register, 
}