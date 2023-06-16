const mongoose = require("mongoose");
// import mongoose from "mongoose";
// const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function initialize() {
  await mongoose.connect(
    "mongodb+srv://OlegSazanov:InDigga222@vkbot-bmw-game.6nywbop.mongodb.net/Telegram_CapsulaBot"
  );
}

// module.exports = {
//   mongoose: mongoose,
// };

const TimeSchema = new mongoose.Schema({
  Time: Date,
  OnWork: Boolean,
  Time2: Date,
  OnWork2: Boolean,
  ChatId: String,
  UserId: String,
  StatusArc: Boolean,
  FestTime: Date,
});
const Time = mongoose.model("Time", TimeSchema);
module.exports = Time;
