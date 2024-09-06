require('dotenv').config()

const express = require('express');
const cors = require('cors')
const mongoose = require ('mongoose')
const app = express();
app.use(cors());
app.use(express.json())




require('./config/mongoose.config');   
require('./routes/book.routes')(app);
require('./routes/comment.routes')(app);
require('./routes/user.routes')(app)
require('./routes/profile.routes')(app)
require('./routes/publicFigure.routes')(app)



const port = 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
