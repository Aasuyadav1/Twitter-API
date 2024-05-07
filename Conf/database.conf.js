const mongoose = require("mongoose");

const URI = process.env.MONGOOSE_URL;

const connectDb = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDb