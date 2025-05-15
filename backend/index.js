const port = process.env.PORT || 3000;
const http = require('http');
const express = require('express');
const app = express();

const auth_routes = require('./routes/auth_routes')

require('dotenv').config()

app.use(express.json());
app.use(auth_routes);

http.createServer(app).listen(port, () => {
    console.log('Server is running on port ' + port);
})