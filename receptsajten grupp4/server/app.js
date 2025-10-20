const express = require('express');
const app = express();

app.use(express.json());


const commentsRouter = require('./routes/comments');
app.use('/', commentsRouter);

module.exports = app;