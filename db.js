/* eslint-disable no-console */
const pgtools = require('pgtools')

const config = {
    user: '',
    password: '',
    port: '',
    host: ''
}

pgtools.createdb(config, 'test-db', (err, res)=> {
    if(err){
        console.log(err);
        process.exit(-1)
    }
    console.log(res)
})