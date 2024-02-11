const mongoose  = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('db is connected........')
}).catch((er)=>{
    console.log('db is not connected',er)
})