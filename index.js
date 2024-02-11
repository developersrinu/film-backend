// const express = require('express');
// const app = express();
// app.use(express.json());
// const cors = require('cors')
// app.use(cors());
// const mongoose = require('mongoose');
// const db = require('./db/mongodb');
// require('dotenv').config();


const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const  db  = require('./db/mongodb'); 
require('dotenv').config();




const userRoute = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const movieRouter = require('./routes/movieRouter');
const bookingsRouter = require('./routes/bookingsRouter');



const port = process.env.PORT || 3000;

// Use the user routess
app.use('/user',userRoute);
app.use('/admin',adminRouter);
app.use('/movie',movieRouter)
app.use('/booking',bookingsRouter)




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


