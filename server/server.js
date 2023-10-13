const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is available")
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`Server Started on Port ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on("connection", (socket) => {
    console.log(`Connection established`)
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room)=> {
        socket.join(room)
        console.log("user joined room: " + room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new chat", (newChatRecieved) => {
        let chat = newChatRecieved.chat
        if(!chat.users) return console.log("chat.users is empty")

        chat.users.forEach(user => {
            if(user._id == newChatRecieved.sender._id) return

            socket.in(user._id).emit("message received", newChatRecieved)
        })
    })
})