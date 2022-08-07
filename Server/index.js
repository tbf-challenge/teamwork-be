const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const helmet = require('helmet');
const app = express();
// const mongoose = require('mongoose');
const User = require('./models/usermodel');
const server = require('http').createServer(app);

const io = new Server(server, {
    crs: {
        origin: 'http://localhost:3000',
        credentials: 'true',
    }
});
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: 'true',
}));
app.use(express.json());

io.on('connect', socket => {});

app.use('/auth', User);

// app.post('/auth/login', async (req, res) => {
//          const user = await User.findOne({
//             email: req.body.email,
//             passwrord: req.body.password, 
//         });
//         res.json({status: 'good'});
        
//             if (user) {
//                 return res.json({status: 'ok', user: true});
//             }
//             else {
//                 return res.json({status: 'error', user: false });
//             }
    
// });

server.listen(5000, () => {
    console.log('Server is ready');
});