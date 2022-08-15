const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const db = require('../db')

const config = require('../config')

const router = express.Router()

router.post('signin', passport.authenticate('local-login', { 
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

router.post('create-user', passport.authenticate('local-signup', { 
    session: false,
    failureRedirect: '/login',
    successRedirect: '/success'
}), (req, res) => {
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
    db.query('INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
    [firstName, lastName, email, password, gender, jobRole,department, address], (error, results) => {
      if (error) {
        throw error
      }
      const body = { id: results.rows[0].id, email: results.rows[0].email }
      const token = jwt.sign({ user: body }, config('SECRET'))

      res.status(201).json({
        status: "success",
        data: {
          message: "User account successfully created",
          token,
          userId: results.rows[0].id
        }
      })
    })
})

module.exports = router

