// <!--- Using mongoose --->
// const mongoose = require('mongoose');
// const User = new mongoose.Schema(
//     {
//     email: { type: String, required:true, unique: true },
//     password: { type: String, required: true },
//     quote: { type: String },
// },
// { collection: 'teamwork-data' }
// )

// const model = mongoose.model('UserDatabase', User);

// module.exports = model


const express = require('express');
const router = express.Router();
const Yup = require('yup');

const validSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email required'),
      password: Yup.string()
      .min(8, 'Password too short')
      .matches(pwdRule, {message: "Must contain at least one number, one uppercase and lowercase letter, a symbol and at least 8 or more characters"})
      .required('Password required')
})

router.post('/login', (req, res) => {
    const data = req.body;
    validSchema.validate(data).catch(err => {
        res.status(422).send();
        console.log(err.errors);
    })
    .then(valid => {
        if (valid) {
            res.status(200).send();
            console.log('Good data')
        }
    });
});

module.exports = router;