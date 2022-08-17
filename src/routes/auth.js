const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const userSevice = require('../services/users')
const validateSchema = require('../middleware/validateSchema')

const validateRequest = validateSchema(true)

const config = require('../config')

const router = express.Router()

router.post('/signin', passport.authenticate('local-login', { 
    session: false,
    failureRedirect: '/login', 
    successRedirect: '/dashboard'
}), (req, res)=> {
    const{ user } = req
    const body = { id: user.id, email: user.email }
    const token = jwt.sign({ user: body }, config('SECRET'))
    return res.json({
        status: 'success',
        data: {
            token,
            userId: user.id
        }

    })
})

router.post('/create-user',
validateRequest, 
async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        gender,
        jobRole,
        department,
        address
      } = req.body

   
   const { token, userId } = await userSevice.createNewUser([
        firstName, 
        lastName,
        email, 
        password, 
        gender, 
        jobRole, 
        department,
        address
    ])



        res.status(201).json({
            status: "success",
            data: {
              message: "User account successfully created",
              token,
              userId
            }
          })

})

module.exports = router

