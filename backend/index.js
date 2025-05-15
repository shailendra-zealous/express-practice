const http = require('http');
const express = require('express');
const app = express();

const routes = require('./routes')

const db = require('./models/index.js');
const User = db.User;

require('dotenv').config()

app.use(express.json());

app.use(routes)




const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
    console.log('Server is running on port ' + port);
})