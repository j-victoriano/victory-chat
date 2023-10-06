const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');

const app = express();
dotenv.config();
connectDB();

app.get('/', (req, res) => {
    res.send("API is available")
});

app.get('/api/chat', (req, res) => {
    res.send(chats)
})

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server Started on Port ${PORT}`.yellow.bold));