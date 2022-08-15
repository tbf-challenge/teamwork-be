const bcrypt   = require('bcrypt-nodejs');

const genPasswordHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

const verifyPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword)

module.exports ={
    genPasswordHash,
    verifyPassword
}