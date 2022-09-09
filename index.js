const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const jwt = require("jsonwebtoken");

const connectDB = require('./server/database/connection');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : false}) ,  bodyparser.json())

// load routers
app.use('/', require('./server/routes/router'))

//Json 
app.use(express.json());

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});