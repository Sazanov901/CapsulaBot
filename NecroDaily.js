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

const DailyDate = new mongoose.Schema({
  Daily: Date,
  Date: Date,
  Friday: Date,
  ChatId: String,

  UserId: String, // выбранная на сегодня
});
const NecroDaily = mongoose.model("NecroDaily", DailyDate);

module.exports = NecroDaily;
