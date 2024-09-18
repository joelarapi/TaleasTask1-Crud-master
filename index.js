require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();


const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

require('./config/mongoose.config');
require('./routes/book.routes')(app);
require('./routes/user.routes')(app);
require('./routes/profile.routes')(app);
require('./routes/publicFigure.routes')(app);
require('./routes/review.routes')(app);
require('./routes/industry.routes')(app);



const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});   
