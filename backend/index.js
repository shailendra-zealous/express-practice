const port = process.env.PORT || 3000;
const http = require('http');
const express = require('express');
const app = express();

const passport = require('passport');
const googleStrategy = require('./helper/google_strategy');

const auth_routes = require('./routes/auth_routes')
const user_routes = require('./routes/user_routes')

require('dotenv').config()

app.use(express.json());
app.use(passport.initialize());
passport.use(googleStrategy());

app.use(auth_routes);
app.use(user_routes);

http.createServer(app).listen(port, () => {
    console.clear()
    console.log('Server is running on port ' + port);
})