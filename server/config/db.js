const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', true);


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log(`mongodb is connected: ${conn.connection.host}`.cyan.underline);

    }
    catch (error) {
        console.log(`error is ${error.message}`.red.bold);
    }

}

module.exports = connectDB;