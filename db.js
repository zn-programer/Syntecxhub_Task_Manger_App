const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.....");
  } catch (error) {
    console.log("Connection failed to MongoDB!", error);
  }
}

module.exports = connectToDB;