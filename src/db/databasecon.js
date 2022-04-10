const mongoose = require('mongoose');
require('dotenv').config()
// console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
}).then(()=>{
    console.log(`database connection success....`)

}).catch((err)=>{
    console.log(`databese connection failed.....${err}`)
}
)