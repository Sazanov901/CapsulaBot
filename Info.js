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

const InfoSchema = new mongoose.Schema({
  ChatId: String,
  UserId: String,
  TimeToWork: Date,
  OnWork: Number,
  WorkVar: Number,
  TimeToFeed: Date,
  TimeToRace: Date,
  TimeToUnderground: Date,
  AutoServiceTime: Date,
  AutoServiceStatus: Boolean,
  StatusParty: Boolean,
  StatusRace: Boolean,
  //
  ZapParts: Number,
  PaintBallon: Number,
  RepairPrice: Number,
  Tape: Number,
  WD: Number,
  Engine: String,
  Suspension: String,
  Bumpers: String,
  Conditioner: String,
  Saloon: String,
  Headlights: String,
  Taillights: String,
  SteeringWheel: String,
  StinkyTree: String,
  Kanistra: String,
  Keys: String,
  FirstAid: String,
});
const Info = mongoose.model("Info", InfoSchema);
module.exports = Info;
