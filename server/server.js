const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    // origin: ["http://localhost:3000"],
    origin: ["https://chatt-app12.netlify.app"]
}));

app.use(express.json());  // to accept JSON data


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// API ERROR HANDLERS

app.use(notFound);
app.use(errorHandler)


const PORT = process.env.PORT;


const server = app.listen(PORT, console.log(`server started on port ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // origin: ["http://localhost:3000"],
        origin: ["https://chatt-app12.netlify.app"],

    }
});


io.on('connection', (socket) => {
    // console.log('connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData.name + ' connected from frontend ');
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        // console.log('User Joined Room: ' + room);
    });


    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));


    socket.on('new message', (newMessagesReceived) => {
        var chat = newMessagesReceived.chat;
        // console.log(chat.users);

        if (!chat.users) {
            // console.log('chat.users not defined');
            return;
        }

        chat.users.forEach((user) => {
            if (user._id == newMessagesReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessagesReceived);
        });

    });


    // socket.off('setup', (userData) => {
    //     console.log('USER DISCONNECTED');
    //     socket.leave(userData._id);
    // })


    socket.on('leave previous chat', (room) => {
        // console.log('User Leaved Room: ', room);
        socket.leave(room);
    })

});