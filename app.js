const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); 
app.use(errorHandler);

//Routes
const articleRoutes = require('./routes/articles');

const api = process.env.API_URL;

app.use(`${api}/articles`, articleRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'myFirstDatabase'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})

//Server
app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
})