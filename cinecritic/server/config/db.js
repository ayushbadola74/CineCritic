const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinecritic');
    console.log(`=========================================`);
    console.log(`🍃 Connected to MongoDB: ${conn.connection.host}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    // Non-fatal, app will still serve TMDB fallback data
  }
};

module.exports = connectDB;
