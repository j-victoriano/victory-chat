const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is available")
});

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server Started on Port ${PORT}`.yellow.bold));