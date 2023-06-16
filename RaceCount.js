const mongoose = require("mongoose");
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

const NumberOfRacers = new mongoose.Schema({
  NumberOfRacers: Number,
  ChatId: String,
  UserId: String,
});
const RaceCount = mongoose.model("RaceCount", NumberOfRacers);

module.exports = RaceCount;
