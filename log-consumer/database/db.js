require('dotenv').config();

const mongoConfig={
    mongouri:process.env.MONGO_URI
}

module.exports=mongoConfig;