const jwt = require('jsonwebtoken')
const { 
  genPasswordHash, 
  verifyPassword,
  generateId
} = require('../lib')

const config = require('../config')
const db = require('../db')

const createNewUser = async(user) => {
  const [ password ] = user
  const passwordHash =  genPasswordHash(password)
  const id = generateId()
  // eslint-disable-next-line max-len
  const { rows, error } = await db.query('INSERT INTO users ("id", "firstName", "lastName", "email", "passwordHash", "gender", "jobRole", "department", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', 
    [id, ...user, passwordHash ])

  if (error) {
    throw error
  }
  const userProfile = rows[0]
  const body = { id: userProfile.id, email: userProfile.email }
  const token = jwt.sign({ user: body }, config('SECRET'))

  return { token, userId: userProfile.id }
}

const getUserByEmail = (email) => {
  db.get('SELECT * FROM users WHERE email = ?', [ email ], (err, row) => {
    let user = { }
    if (err) { throw err }
    if (!row) { return user  }
    user = { email: row.email, passwordHash: row.passwordHash, id: row.id } 

    return user
  })
}

const signInUserByEmail = (email, password) => {
    const user = getUserByEmail(email)
   
    if (!user.email) { return { message: 'Incorrect username or password.'} }
     
    if(!verifyPassword(password, user.password)){ 
      return { message: 'Incorrect username or password.'} 
    }
    const body = { id: user.id, email: user.email }
    const token = jwt.sign({ user: body }, config('SECRET'))

    return { token, userId: user.id }
}


module.exports ={
  createNewUser,
  getUserByEmail,
  signInUserByEmail
}