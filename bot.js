const { VK, Upload, MessageSource, Keyboard, Context } = require("vk-io");
const { HearManager } = require("@vk-io/hear");
const { KeyboardBuilder } = require("vk-io");
const fs = require("fs");
const { PhotoAttachment } = require("vk-io");

const Vk = new VK({
  token:
    "vk1.a.RvdemXZOVaaJaggnlmrUSD2pwfLGv_gkVy9tuOK_cMyl4CtxtYctnbZt3bLkt8DYh2g4CVSWa-qmzFiCGCYWJi5XbTSVgA_J08ffEOv2uEUsCHNyxEZPjSJ16iTxT9ssj0K9RHVp3JBmeymYp1PlPiUbaEbUXuZI9dxHMRUotdInnSNG7URLNP9Ce3xD9Fgh7zx3FNg05P1YHr6pXz0c8Q",
});
const vk = new VK({
  token:
    "vk1.a.tMECBZi_u5Ga1HziTLtfKw_CORaMDnEeiERF42wM2vHCac9uSScuNoTKvC-jtpzygdNeZWsz7YRhnhDAaLuOkoFLce-LY2GGLFy5spPEF2OEKCZuy_AfZZJI97bcLwLD237gg7g7Yq804nAX2ok5EYCroeoM54MWbeaEhhpwC734M47hplZwu7qeM2rVv7p3mr3Fi-T3PoCzDfZcrifeIA",
});
// vk1.a.RvdemXZOVaaJaggnlmrUSD2pwfLGv_gkVy9tuOK_cMyl4CtxtYctnbZt3bLkt8DYh2g4CVSWa-qmzFiCGCYWJi5XbTSVgA_J08ffEOv2uEUsCHNyxEZPjSJ16iTxT9ssj0K9RHVp3JBmeymYp1PlPiUbaEbUXuZI9dxHMRUotdInnSNG7URLNP9Ce3xD9Fgh7zx3FNg05P1YHr6pXz0c8Q
vk.updates
  .startWebhook({
    path: "/webhook", // URL-адрес, на который будет отправляться запрос
    port: 3000, // порт, на котором будет запущен сервер
  })
  .then(() => {
    console.log("Webhook запущен");
  })
  .catch((error) => {
    console.error(error);
  });
vk.api.messages.getConversations({}).then(console.log).catch(console.error);

const mongoose = require("mongoose");
// import mongoose from "mongoose";
const db =
  "mongodb+srv://OlegSazanov:InDigga222@vkbot-bmw-game.6nywbop.mongodb.net/VK-Bot";

const Car = require("./MyCar.js");
const RandomCar = require("./RandomCar.js");
const Time = require("./TimeVK.js");
const Info = require("./Info.js");
const RaceCount = require("./RaceCount.js");
const LastPhoto = require("./SendingPhoto.js");
const NecroDaily = require("./NecroDaily.js");
const { info } = require("console");

const bot = new HearManager();
vk.updates.on("message_new", bot.middleware);

(async function initialize() {
  await vk.updates.startPolling();
  console.log(`Polling started at ${new Date()}`);

  const database = await mongoose.connect(db, {
    connectTimeoutMS: 15000,
  });

  if (!database) {
    console.log("Error");
  }
  console.log("Connected to db");
})();
let ReadyToWork;
let ReadyToFeed;
let FestInfo;
let photoUrl;

let keyboard;
bot.hear(/^Подписаться на рассылку$/i, async (msg) => {
  const chatId = msg.peerId;
  const userId = msg.senderId;
  msg.send("Вы подписались на рассылку");
  const photoUrls = [
    "photo-218124566_457239022",
    "photo-218124566_457239023",
    "photo-218124566_457239024",
    "photo-218124566_457239025",
    "photo-218124566_457239026",
    "photo-218124566_457239027",
    "photo-218124566_457239028",
    "photo-218124566_457239039",
    "photo-218124566_457239043",
    "photo-218124566_457239044",
  ];
  let pictureFound = false;
  let photoUrl;

  const IfExist = await LastPhoto.findOne({ ChatId: chatId });
  if (!IfExist) {
    const PhotoDB = await LastPhoto.create({
      ChatId: chatId,
      // RecentPhoto: photoUrl,
      SendingStatus: true,
    });
  } else {
    const PhotoDB = await LastPhoto.findOneAndUpdate(
      {
        ChatId: chatId,
      },
      {
        // RecentPhoto: photoUrl,
        SendingStatus: true,
      }
    );
  }

  async function GetRandomPicture() {
    let pictureFound = false;
    let photoUrl = "";
    const PhotoDB = await LastPhoto.findOne({ ChatId: chatId });

    while (!pictureFound && PhotoDB.SendingStatus) {
      const randomNum = Math.floor(Math.random() * photoUrls.length);
      photoUrl = photoUrls[randomNum];

      // Проверяем, есть ли фото в базе данных
      const pictureExists = await Car.findOne({
        ChatId: chatId,
        CarPicture: photoUrl,
      });

      if (!pictureExists) {
        pictureFound = true;

        console.log(photoUrl);

        const PhotoDB = await LastPhoto.findOneAndUpdate(
          {
            ChatId: chatId,
          },
          {
            RecentPhoto: photoUrl,
            SendingStatus: true,
          }
        );
        msg.send({
          message: `Только что появился вот такой вариантик. Ну что, брать будешь?`,
          attachment: photoUrl,
        });
        // const IfExist = await LastPhoto.findOne({ ChatId: chatId });
        // if (!IfExist) {
        //   const PhotoDB = await LastPhoto.create({
        //     ChatId: chatId,
        //     RecentPhoto: photoUrl,
        //     SendingStatus: true,
        //   });
        // } else {
        // }
      }
    }
  }
  const timerId = setInterval(GetRandomPicture, 360000);

  // bot.hear(/^Остановить рассылку$/i, async (msg) => {
  //   // clearInterval(timerId);
  //   const PhotoDB = await LastPhoto.findOneAndUpdate({
  //     ChatId: chatId,
  //     RecentPhoto: "Чат не подписан на рассылку",
  //     SendingStatus: false,
  //   });
  //   msg.send("Вы отписались от рассылки");
  // });

  bot.hear(/Взять некруху$/i, async (msg) => {
    const chatId = msg.peerId;
    const userId = msg.senderId;
    if (msg.isOutbox) return;
    const CarExist = await Car.findOne({ ChatId: chatId, UserId: userId });
    if (CarExist) {
      msg.send("У тебя уже есть некруха!");
      return;
    }
    const PhotoFromDB = await LastPhoto.findOne({ ChatId: chatId });
    const photoUrl = PhotoFromDB.RecentPhoto;

    const result = await Car.findOne({
      ChatId: chatId,
      CarPicture: photoUrl,
    });

    console.log(PhotoFromDB.SendingStatus);

    if (result) {
      msg.send("Эту некруху уже кто то забрал!");
      return;
    } else if (PhotoFromDB.SendingStatus === true) {
      const FreePhoto = PhotoFromDB.RecentPhoto;

      // const chatId = msg.peerId;
      // const userId = msg.senderId;
      console.log(chatId);
      const RepairStart = 75;
      const StartZero = 0;

      const idCar = await Car.create({
        UserId: userId,
        ChatId: chatId,
        Name: "Ваша некруха",
        Level: StartZero,
        Exp: StartZero,
        ConditionNumber: StartZero,
        Condition: "Нужен ремонт",
        Health: "Нужна покраска",
        Money: StartZero,
        Class: "Районная",
        Fuel: StartZero,
        CarPicture: FreePhoto,
        DateOfCreation: new Date(),
      });
      const TimeThen = await Time.create({
        ChatId: chatId,
        UserId: userId,
        Time: new Date(),
        OnWork: false,
        Time2: new Date(),
        OnWork2: false,
        StatusArc: false,
        FestTime: new Date(),
      });
      const ActionInfo = await Info.create({
        ChatId: chatId,
        UserId: userId,
        TimeToWork: new Date(),
        OnWork: StartZero,
        WorkVar: StartZero,
        TimeToFeed: new Date(),
        TimeToRace: new Date(),
        TimeToUnderground: new Date(),
        AutoServiceTime: new Date(),
        AutoServiceStatus: false,
        StatusParty: false,
        StatusRace: false,
        //
        ZapParts: StartZero,
        PaintBallon: StartZero,
        RepairPrice: RepairStart,
        Tape: StartZero,
        WD: StartZero,
        Engine: "м10",
        Suspension: "Убитая",
        Bumpers: "Стандарт",
        Conditioner: "Нет",
        Saloon: "Ткань",
        Headlights: "Мутные",
        Taillights: "С трещинами",
        SteeringWheel: "Затертый",
        StinkyTree: "Нет",
        Kanistra: "Нет",
        Keys: "Нет",
        FirstAid: "Нет",
      });

      keyboard = new KeyboardBuilder()
        .row()
        .inline()
        .textButton({
          label: "Гараж",
          payload: {
            command: "Гараж",
          },
          color: Keyboard.POSITIVE_COLOR,
        })
        .inline()
        .textButton({
          label: "Инфо",
          payload: {
            command: "Инфо",
          },
          color: Keyboard.NEGATIVE_COLOR,
        })
        .row()
        .inline()
        .textButton({
          label: "Клуб",
          payload: {
            command: "Клуб",
          },
          color: Keyboard.SECONDARY_COLOR,
        })
        .inline()
        .textButton({
          label: "Музей",
          payload: {
            command: "Музей",
          },
          color: Keyboard.SECONDARY_COLOR,
        })
        .oneTime();

      const nextLevelExperience = (idCar.Level + 5) * 2;
      let attachment = idCar.CarPicture;
      msg.send({
        message: `✏Имя: ${idCar.Name}\n🏆Уровень: ${idCar.Level}\n🏁Опыт: ${idCar.Exp}/${nextLevelExperience}\n🛠Состояние: ${idCar.Condition}(${idCar.ConditionNumber})\n🚘Пороги: ${idCar.Health}\n💰Счет: ${idCar.Money}💵\n🛢Топливо: ${idCar.Fuel}⛽`,
        keyboard: keyboard,
        attachment: attachment,
      });
    } else {
      msg.send("Вы не подписаны на рассылку");
    }
  });
});

bot.hear(/^Отписаться от рассылки$/i, async (msg) => {
  // clearInterval(timerId);

  const chatId = msg.peerId;

  msg.send("Вы отписались от рассылки");
  const PhotoDB = await LastPhoto.findOneAndUpdate(
    {
      ChatId: chatId,
    },
    {
      // RecentPhoto: "Чат не подписан на рассылку",
      SendingStatus: false,
    }
  );
});

bot.hear(/^11$/i, (msg) => {
  if (msg.isOutbox) return;

  console.log(msg);
  msg.send(msg.senderId);
});

bot.hear(/^Дать некрухе имя*/i, async (msg) => {
  if (msg.isOutbox) return;
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const newName = msg.text
    .replace("Дать некрухе имя", "")
    .replace("дать некрухе имя", "")
    .trim();

  const name = await Car.updateOne(
    {
      UserId: userId,
      ChatId: chatId,
    },
    { Name: newName },
    { upsert: false, new: true }
  );
  if (!name) {
    bot.sendMessage(chatId, "У Вас нет некрухи");
    return;
  }
  const arr = [
    { a: "Отличное имя!" },
    { b: "Ну, можно было придумать имя и по-лучше!" },
  ];
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomReaction = arr[randomIndex];

  msg.send(`${newName}? \n${Object.values(randomReaction)}`);
});

bot.hear(/Моя некруха$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  if (msg.isOutbox) return;

  const idCar = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (!idCar) {
    msg.send("У Вас нет некрухи! :(");
    return;
  }
  // let keyboard;
  keyboard = new KeyboardBuilder()
    .row()
    .inline()
    .textButton({
      label: "Гараж",
      payload: {
        command: "Гараж",
      },
      color: Keyboard.POSITIVE_COLOR,
    })
    .inline()
    .textButton({
      label: "Инфо",
      payload: {
        command: "Инфо",
      },
      color: Keyboard.NEGATIVE_COLOR,
    })
    .row()
    .inline()
    .textButton({
      label: "Клуб",
      payload: {
        command: "Клуб",
      },
      color: Keyboard.SECONDARY_COLOR,
    })
    .inline()
    .textButton({
      label: "Музей",
      payload: {
        command: "Музей",
      },
      color: Keyboard.SECONDARY_COLOR,
    })
    .oneTime();

  const photoUrl = idCar.CarPicture;

  const nextLevelExperience = (idCar.Level + 5) * 2;
  let attachment = idCar.CarPicture;

  if (idCar.Condition === "Нужен ремонт") {
    msg.send({
      message: `✏Имя: ${idCar.Name}\n🏆Уровень: ${idCar.Level}\n🏁Опыт: ${idCar.Exp}/${nextLevelExperience}\n🛠Состояние: ${idCar.Condition}\n🚘Пороги: ${idCar.Health}\n💰Счет: ${idCar.Money}💵\n🛢Топливо: ${idCar.Fuel}⛽`,
      keyboard: keyboard,
      attachment: photoUrl,
    });
  } else {
    msg.send({
      message: `✏Имя: ${idCar.Name}\n🏆Уровень: ${idCar.Level}\n🏁Опыт: ${idCar.Exp}/${nextLevelExperience}\n🛠Состояние: ${idCar.Condition}(${idCar.ConditionNumber})\n🚘Пороги: ${idCar.Health}\n💰Счет: ${idCar.Money}💵\n🛢Топливо: ${idCar.Fuel}⛽`,
      keyboard: keyboard,
      attachment: photoUrl,
    });
  }
});

bot.hear(/^Сдать некруху$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CarDelete = await Car.findOne({ ChatId: chatId, UserId: userId });
  // let options;
  if (!CarDelete) {
    msg.send("У Вас нет некрухи :(");
    return;
  } else {
    // place for keyboard for question message - пока без подтверждения
    const photo = "photo-218124566_457239035";
    const DeleteCar = await Car.deleteOne({
      UserId: userId,
      ChatId: chatId,
    });
    const DeleteTime = await Time.deleteOne({
      UserId: userId,
      ChatId: chatId,
    });
    const DeleteInfo = await Info.deleteOne({
      UserId: userId,
      ChatId: chatId,
    });
    msg.send({
      message: "Вы сдали свою некруху в разбор! :(",
      attachment: photo,
    });
    console.log("Car deleted");
  }
});

bot.hear(/Инфо$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const TimeNow = new Date();

  const infoId = await Info.findOne({ ChatId: chatId, UserId: userId });
  if (infoId.TimeToWork.getTime() < TimeNow.getTime() && infoId.OnWork === 0) {
    ReadyToWork = "Можно на работу";

    keyboard = new KeyboardBuilder()
      .row()

      .textButton({
        label: "Отправиться на работу",
        payload: { command: "Отправиться на работу" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Заправить некруху",
        payload: { command: "Заправить некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .inline()
      .textButton({
        label: "Гонка",
        payload: { command: "Гонка" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .textButton({
        label: "БМВ фест",
        payload: { command: "БМВ фест" },
        color: Keyboard.NEGATIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })

      .oneTime();
  } else if (
    infoId.TimeToWork.getTime() < TimeNow.getTime() &&
    infoId.OnWork > 0
  ) {
    ReadyToWork = "Можно завершить работу";

    keyboard = new KeyboardBuilder()
      .row()
      .textButton({
        label: "Завершить работу",
        payload: { command: "Завершить работу" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Заправить некруху",
        payload: { command: "Заправить некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .inline()
      .textButton({
        label: "Гонка",
        payload: { command: "Гонка" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .textButton({
        label: "БМВ фест",
        payload: { command: "БМВ фест" },
        color: Keyboard.NEGATIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })

      .oneTime();
  } else if (
    infoId.TimeToWork.getTime() > TimeNow.getTime() &&
    infoId.OnWork > 0
  ) {
    const TimeAnswer = infoId.TimeToWork.getTime() - TimeNow.getTime(); //разница
    const dateInHours = Math.floor(TimeAnswer / 1000 / 60 / 60);
    console.log("dateInHours:", dateInHours);
    const dateInMinutes = Math.floor(TimeAnswer / 1000 / 60) - dateInHours * 60;
    console.log("dateInMinutes:", dateInMinutes);
    ReadyToWork = `Можно завершить работу через ${dateInHours}ч:${dateInMinutes}м`;

    keyboard = new KeyboardBuilder()

      .row()
      .textButton({
        label: "Заправить некруху",
        payload: { command: "Заправить некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .inline()
      .textButton({
        label: "Гонка",
        payload: { command: "Гонка" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .textButton({
        label: "БМВ фест",
        payload: { command: "БМВ фест" },
        color: Keyboard.NEGATIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })

      .oneTime();

    console.log(Math.floor(TimeAnswer / 1000));
    console.log(`${dateInHours}:${dateInMinutes}`);
  }
  if (infoId.TimeToFeed.getTime() < TimeNow.getTime()) {
    ReadyToFeed = "Можно заправить";
  } else {
    const TimeAnswer2 = infoId.TimeToFeed.getTime() - TimeNow.getTime(); //разница
    const dateInHours = Math.floor(TimeAnswer2 / 1000 / 60 / 60);
    console.log("dateInHours:", dateInHours);
    const dateInMinutes =
      Math.floor(TimeAnswer2 / 1000 / 60) - dateInHours * 60;
    console.log("dateInMinutes:", dateInMinutes);
    ReadyToFeed = `Можно заправить через ${dateInHours}ч:${dateInMinutes}м`;
    //
    //
    //

    // const infoId = await Info.findOne({ ChatId: chatId, UserId: userId });
    if (
      infoId.TimeToWork.getTime() < TimeNow.getTime() &&
      infoId.OnWork === 0
    ) {
      ReadyToWork = "Можно на работу";

      keyboard = new KeyboardBuilder()
        .row()

        .textButton({
          label: "Отправиться на работу",
          payload: { command: "Отправиться на работу" },
          color: Keyboard.POSITIVE_COLOR,
        })

        .row()
        .inline()
        .textButton({
          label: "Гонка",
          payload: { command: "Гонка" },
          color: Keyboard.POSITIVE_COLOR,
        })

        .textButton({
          label: "БМВ фест",
          payload: { command: "БМВ фест" },
          color: Keyboard.NEGATIVE_COLOR,
        })
        .row()
        .textButton({
          label: "Моя некруха",
          payload: { command: "Моя некруха" },
          color: Keyboard.SECONDARY_COLOR,
        })

        .oneTime();
    } else if (
      infoId.TimeToWork.getTime() < TimeNow.getTime() &&
      infoId.OnWork > 0
    ) {
      ReadyToWork = "Можно завершить работу";

      keyboard = new KeyboardBuilder()
        .row()
        .textButton({
          label: "Завершить работу",
          payload: { command: "Завершить работу" },
          color: Keyboard.POSITIVE_COLOR,
        })

        .row()
        .inline()
        .textButton({
          label: "Гонка",
          payload: { command: "Гонка" },
          color: Keyboard.POSITIVE_COLOR,
        })

        .textButton({
          label: "БМВ фест",
          payload: { command: "БМВ фест" },
          color: Keyboard.NEGATIVE_COLOR,
        })
        .row()
        .textButton({
          label: "Моя некруха",
          payload: { command: "Моя некруха" },
          color: Keyboard.SECONDARY_COLOR,
        })

        .oneTime();
    } else if (
      infoId.TimeToWork.getTime() > TimeNow.getTime() &&
      infoId.OnWork > 0
    ) {
      const TimeAnswer = infoId.TimeToWork.getTime() - TimeNow.getTime(); //разница
      const dateInHours = Math.floor(TimeAnswer / 1000 / 60 / 60);
      console.log("dateInHours:", dateInHours);
      const dateInMinutes =
        Math.floor(TimeAnswer / 1000 / 60) - dateInHours * 60;
      console.log("dateInMinutes:", dateInMinutes);
      ReadyToWork = `Можно завершить работу через ${dateInHours}ч:${dateInMinutes}м`;

      keyboard = new KeyboardBuilder()

        .row()
        .inline()
        .textButton({
          label: "Гонка",
          payload: { command: "Гонка" },
          color: Keyboard.POSITIVE_COLOR,
        })

        .textButton({
          label: "БМВ фест",
          payload: { command: "БМВ фест" },
          color: Keyboard.NEGATIVE_COLOR,
        })
        .row()
        .textButton({
          label: "Моя некруха",
          payload: { command: "Моя некруха" },
          color: Keyboard.SECONDARY_COLOR,
        })

        .oneTime();

      console.log(Math.floor(TimeAnswer / 1000));
      console.log(`${dateInHours}:${dateInMinutes}`);
    }

    //
    //
    //

    console.log(Math.floor(TimeAnswer2 / 1000));
    console.log(`${dateInHours}:${dateInMinutes}`);
  }
  let Status;
  const RaceStatus = await Info.findOne({ ChatId: chatId, UserId: userId });
  if (RaceStatus.StatusRace == true) {
    Status = "Участвует в гонке!";
  } else {
    Status = "Не участвует в гонке";
  }

  const TimeLast = await Time.findOne({ ChatId: chatId, UserId: userId });
  // if (!TimeLast) {
  //   bot.sendMessage(chatId, "У Вас нет некрухи");
  //   return;
  // }
  const TimeNoww = new Date() * 1;
  console.log("last: ", TimeLast.FestTime);
  console.log("now:", TimeNow);

  const Arc = await Car.findOne({ ChatId: chatId, UserId: userId });
  let ArcStat = Arc.Health;
  if (TimeLast.FestTime.getTime() < TimeNoww && ArcStat === "Нужна покраска") {
    FestInfo = "Можно на фест!";
  }
  if (TimeLast.FestTime.getTime() < TimeNoww && ArcStat === "Еще походит") {
    FestInfo = "Ваша арка как новая, можно на фест!";
  }
  if (TimeLast.FestTime.getTime() > TimeNoww) {
    const TimeFest = TimeLast.FestTime.getTime() - TimeNoww;
    const dateInHours = Math.floor(TimeFest / 1000 / 60 / 60);
    console.log("dateInHours:", dateInHours);
    const dateInMinutes = Math.floor(TimeFest / 1000 / 60) - dateInHours * 60;
    console.log("dateInMinutes:", dateInMinutes);

    FestInfo = `На фест можно через ${dateInHours}ч:${dateInMinutes}м`;

    // Keyboard.inline_keyboard[2].pop();
  }

  const idCar = await Car.findOne({ ChatId: chatId, UserId: userId });

  // const photoUrl = idCar.CarPicture;

  const nextLevelExperience = (idCar.Level + 5) * 2;
  let attachment = idCar.CarPicture;
  msg.send({
    message: `${idCar.Name}\n \n💰: ${ReadyToWork} \n⛽: ${ReadyToFeed}\n \n🚦: ${Status}\n🏆: ${FestInfo}`,
    keyboard: keyboard,
    // attachment: photoUrl,
  });
});

bot.hear(/Заправить некруху$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const TimeLast = await Info.findOne({ ChatId: chatId, UserId: userId });
  if (!TimeLast) {
    msg.send("У Вас нет некрухи :(");
    return;
  }
  const FuelInfo = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (FuelInfo.Fuel >= 60) {
    msg.send("У вас полный бак!");
    return;
  }

  const TimeNow = new Date() * 1;
  console.log("last: ", TimeLast.TimeToFeed.getTime());
  console.log("now:", TimeNow);

  if (TimeLast.TimeToFeed.getTime() < TimeNow) {
    const TimeThen = TimeNow + 60000;
    const idCar = await Info.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { TimeToFeed: TimeThen },
      { upsert: true, new: true }
    );
    const fuelLimit = await Car.findOne({ ChatId: chatId, UserId: userId });
    if (fuelLimit.Fuel >= 51) {
      const Zapravka = 60 - fuelLimit.Fuel;
      const fuelid = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { $inc: { Fuel: Zapravka } },
        { upsert: false, new: true }
      );

      msg.send(`Вы заправили свою некруху!\n +${Zapravka}⛽`);
    } else {
      const Zapravka = 10;
      const fuelid = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { $inc: { Fuel: Zapravka } },
        { upsert: false, new: true }
      );
      console.log(TimeThen);
      msg.send("Вы заправили свою некруху!\n +10⛽");
      // return;
    }
  } else msg.send("Заправлять некруху можно раз в 2 часа!");
  console.log(TimeNow);

  return;
});

bot.hear(/Отправиться на работу$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const TimeLast = await Info.findOne({ ChatId: chatId, UserId: userId });
  let LastTime = TimeLast.TimeToWork.getTime();
  const TimeNow = new Date() * 1;
  const Picture = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (!Picture) {
    msg.send("У Вас нет некрухи! :(");
  } else if (TimeLast.OnWork > 0 && TimeLast.WorkVar > 0) {
    msg.send("Вы уже на работе!");
  } else {
    // let keyboard;
    if (Picture.Condition === "На ходу") {
      keyboard = new KeyboardBuilder()
        .row()
        .textButton({
          label: "Механик",
          payload: { command: "Механик" },
          color: Keyboard.SECONDARY_COLOR,
        })
        .row()
        .textButton({
          label: "Такси",
          payload: { command: "Такси" },
          color: Keyboard.POSITIVE_COLOR,
        })
        .row()
        .textButton({
          label: "Катать свадьбу",
          payload: { command: "Катать свадьбу" },
          color: Keyboard.NEGATIVE_COLOR,
        })
        .row()
        .textButton({
          label: "Моя некруха",
          payload: { command: "Моя некруха" },
          color: Keyboard.SECONDARY_COLOR,
        })
        .inline()
        .oneTime();

      const photoUrl = Picture.CarPicture;
      msg.send({
        message: `У вас есть три варианта работы: \n \n🔧Механик🔧 \nВы будете ремонтировать машины и получать за это хорошую оплату. Ваша некруха точно не сломается.\n\n🚖Таксист🚖\nРабота на колесах! Вы будете перевозить людей по городу и получать свой заработок. Но будьте осторожны на дороге, это может быть опасно.\n\n🎩Катать свадьбу 🎩 \nВам предстоит работа на свадьбах,  с красивыми нарядами и возможностью заработать неплохие деньги. Но не забывайте, что вы должны быть ответственны и предоставлять исправный транспорт для своих пассажиров.`,
        keyboard: keyboard,
        // attachment: photoUrl,
      });
    } else if (Picture.Condition === "Нужен ремонт") {
      keyboard = new KeyboardBuilder()
        .row()
        .textButton({
          label: "Механик",
          payload: { command: "Механик" },
          color: Keyboard.SECONDARY_COLOR,
        })

        .row()
        .textButton({
          label: "Моя некруха",
          payload: { command: "Моя некруха" },
          color: Keyboard.SECONDARY_COLOR,
        })
        .inline()
        .oneTime();

      const photoUrl = Picture.CarPicture;
      msg.send({
        message: `Ваша некруха не на ходу, Вы можете начать работу механиком: \n \n🔧Механик🔧 \nВы будете ремонтировать машины и получать за это хорошую оплату. Ваша некруха точно не сломается.`,
        keyboard: keyboard,
        // attachment: photoUrl,
      });
    }
  }
});

bot.hear(/Механик$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const TimeLast = await Info.findOne({ ChatId: chatId, UserId: userId });
  if (!TimeLast) {
    msg.send("У Вас нет некрухи");
    return;
  }
  const TimeNow = new Date() * 1;
  const TimeThen = TimeNow + 7200000;

  let LastTime = TimeLast.TimeToWork.getTime();
  console.log("lst:", TimeLast.TimeToFeed.getTime());
  console.log("now:", TimeNow);
  console.log("thn:", TimeThen);

  if (LastTime < TimeNow && TimeLast.OnWork == 0) {
    const Work = 1;
    const WorkNumber = 1;
    const idCar = await Info.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { TimeToWork: TimeThen, OnWork: Work, WorkVar: WorkNumber },
      { upsert: false, new: true }
    );

    console.log(TimeThen);

    msg.send("Вы отправились на работу");

    return;
  } else if (LastTime > TimeNow && TimeLast.OnWork == 1) {
    msg.send("Вы уже на работе!");
    console.log(TimeNow);
    console.log(TimeThen);
    console.log(LastTime);
    return;
  }
});

bot.hear(/Такси$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const TimeLast = await Info.findOne({ ChatId: chatId, UserId: userId });
  let LastTime = TimeLast.TimeToWork.getTime();
  const TimeNow = new Date() * 1;
  if (!TimeLast) {
    msg.send("У Вас нет некрухи");
    return;
  }
  const FuelInfo = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (FuelInfo.Fuel < 5) {
    msg.send("У Вас мало топлива!");
    return;
  }
  const CarCondition = await Car.findOne({
    ChatId: chatId,
    UserId: userId,
  });
  if (CarCondition.Condition === "На ходу") {
    const TimeThen = TimeNow + 60000;

    console.log("last: ", TimeLast.TimeToFeed.getTime());
    console.log("now:", TimeNow);
    console.log("then:", TimeThen);

    if (LastTime < TimeNow && TimeLast.OnWork == 0) {
      const Work = 1;
      const WorkNumber = 2;
      const idCar = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { TimeToWork: TimeThen, OnWork: Work, WorkVar: WorkNumber },
        { upsert: true, new: true }
      );
      let FuelPrice = 5;
      const FuelDecrement = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { $inc: { Fuel: -FuelPrice } }
      );

      console.log(TimeThen);

      msg.send("🚖 Вы отправились работать в такси 🚖\n -5⛽");

      return;
    }
  }
  if (CarCondition.Condition === "Нужен ремонт") {
    msg.send("Ваша некруха не на ходу, Вы не можете начать работу в такси!");
  } else if (LastTime > TimeNow && TimeLast.OnWork == 1) {
    msg.send("Вы уже на работе!");
    console.log(TimeNow);
    console.log(TimeThen);
    console.log(LastTime);
    return;
  }
});

bot.hear(/Катать свадьбу$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const TimeLast = await Info.findOne({ ChatId: chatId, UserId: userId });
  let LastTime = TimeLast.TimeToWork.getTime();
  if (!TimeLast) {
    msg.send("У Вас нет некрухи");
    return;
  }
  const FuelInfo = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (FuelInfo.Fuel < 8) {
    msg.send("У Вас мало топлива!");
    return;
  }

  const CarCondition = await Car.findOne({
    ChatId: chatId,
    UserId: userId,
  });
  const TimeNow = new Date() * 1;
  if (CarCondition.Condition === "На ходу") {
    const TimeThen = TimeNow + 60000;

    console.log("last: ", TimeLast.TimeToFeed.getTime());
    console.log("now:", TimeNow);
    console.log("then:", TimeThen);

    if (LastTime < TimeNow && TimeLast.OnWork == 0) {
      const Work = 1;
      const WorkNumber = 3;
      const idCar = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { TimeToWork: TimeThen, OnWork: Work, WorkVar: WorkNumber },
        { upsert: true, new: true }
      );
      let FuelPrice = 8;
      const FuelDecrement = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { $inc: { Fuel: -FuelPrice } }
      );

      console.log(TimeThen);

      msg.send("🎩 Вы отправились катать свадьбу! 🎩\n -8⛽");

      return;
    }
  }
  if (CarCondition.Condition === "Нужен ремонт") {
    msg.send("Ваша некруха не на ходу, Вы не можете начать работу шафером!");
  } else if (LastTime > TimeNow && TimeLast.OnWork == 1) {
    msg.send("Вы уже на работе!");
    console.log(TimeNow);
    console.log(TimeThen);
    console.log(LastTime);
    return;
  }
});

bot.hear(/Завершить работу$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const TimeLast = await Info.findOne({
    ChatId: chatId,
    UserId: userId,
  });
  const WorkVarStatus = TimeLast.WorkVar;
  if (!TimeLast) {
    msg.send("У Вас нет некрухи :(");
    return;
  }
  if (TimeLast.OnWork == 0) {
    msg.send("Вы не на работе");
    return;
  }
  const TimeNow = new Date();
  if (
    TimeLast.TimeToWork.getTime() < TimeNow.getTime() &&
    TimeLast.OnWork > 0
  ) {
    if (WorkVarStatus === 1) {
      const Work = 0;
      // const TimeThen = new Date() * 1 + 120000;
      const idTime = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        {
          //  TimeToWork: TimeThen,
          OnWork: Work,
        },
        { upsert: false, new: true } // new: true - возвращает обьект после изменений;
      );
      console.log(idTime);

      const MoneyInc = Math.floor(Math.random() * 15) + 49; //от 49 до 64
      const Exp = await Car.findOne({
        ChatId: chatId,
        UserId: userId,
      });

      const CarLevel = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { $inc: { Money: MoneyInc } },
        { upsert: false, new: true }
      );
      const Zero = 0;
      const TypeWork = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { WorkVar: Zero },
        { upsert: false, new: true }
      );
      console.log("Level: ", CarLevel);

      msg.send(`Отличная работа!\n+${MoneyInc}💵`);
    }
    if (WorkVarStatus === 2) {
      const Work = 0;
      // const TimeThen = new Date() * 1 + 360000;
      const idTime = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        {
          // TimeToWork: TimeThen,
          OnWork: Work,
        },
        { upsert: false, new: true } // new: true - возвращает обьект после изменений;
      );
      console.log(idTime);
      // console.log(TimeThen);

      const MoneyInc = Math.floor(Math.random() * 27) + 95; //95-112
      const Exp = await Car.findOne({
        ChatId: chatId,
        UserId: userId,
      });

      const ExpInc = 4;
      const lll = Exp.Level;
      const ConditionDec = Math.floor(Math.random() * 10) + 5;
      const CarLevel = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        {
          $inc: {
            Money: MoneyInc,
            Exp: ExpInc,
            ConditionNumber: -ConditionDec,
          },
        },
        { upsert: false, new: true }
      );
      const Zero = 0;
      const TypeWork = await Info.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { WorkVar: Zero },
        { upsert: false, new: true }
      );
      console.log("Level: ", CarLevel);
      // проверка не ниже ли нуля
      const CarCond = await Car.findOne({ ChatId: chatId, UserId: userId });
      if (CarCond.ConditionNumber <= 0) {
        msg.send("О нет! Ваша некруха сломалась!");
        const ZeroNumber = 0;
        const Broke = await Car.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          { ConditionNumber: ZeroNumber, Condition: "Нужен ремонт" },
          {
            upsert: false,
            new: true,
          }
        );
      }

      const nextLevelExperience = (CarLevel.Level + 5) * 2;
      if (CarLevel.Exp < nextLevelExperience) {
        msg.send(`Отличная работа!\n+${MoneyInc}💵 \n+4🏁`);
        const CarBroke = Math.floor(Math.random() * 4) + 1; // 20% вероятность

        if (CarBroke === 1) {
          msg.send("О нет! Ваша некруха сломалась!");
          const ZeroNumber = 0;
          const Broke = await Car.findOneAndUpdate(
            { ChatId: chatId, UserId: userId },
            { ConditionNumber: ZeroNumber, Condition: "Нужен ремонт" },
            {
              upsert: false,
              new: true,
            }
          );
        }
      } else if (CarLevel.Exp >= nextLevelExperience) {
        const LevelUp = lll + 1;
        const Inc = CarLevel.Exp - nextLevelExperience;

        const sCar = await Car.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          { Level: LevelUp, Exp: Inc },
          { upsert: false, new: true }
        );
        msg.send(`Отличная работа!\n+${MoneyInc}💵 \n+4🏁`);
        const name = sCar.Name;

        msg.send(`Некруха ${name} получает новый уровень!`);
      }
    }
    if (WorkVarStatus === 3) {
      const CarBroke = Math.floor(Math.random() * 4) + 1; // 20% вероятность

      if (CarBroke === 1) {
        msg.send(
          "О нет! Ваша некруха сломалась прямо на работе! Вам пришлось возмещать моральный ущерб от испорченной свадьбы! - 100$! :("
        );
        const Fine = 100;

        const ZeroNumber = 0;

        const Broke = await Car.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          {
            ConditionNumber: ZeroNumber,
            Condition: "Нужен ремонт",
            $inc: { Money: -Fine },
          },
          {
            upsert: false,
            new: true,
          }
        );
        const Work = 0;
        const WorkStatus = await Info.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          {
            OnWork: Work,
            WorkVar: Work,
          },
          { upsert: false, new: true }
        );
      } else {
        const Work = 0;
        // const TimeThen = new Date() * 1 + 360000;
        const idTime = await Info.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          {
            // TimeToWork: TimeThen,
            OnWork: Work,
            WorkVar: Work,
          },
          { upsert: false, new: true } // new: true - возвращает обьект после изменений;
        );
        console.log(idTime);
        // console.log(TimeThen);

        const MoneyInc = Math.floor(Math.random() * 75) + 269; //269-344
        const Exp = await Car.findOne({
          ChatId: chatId,
          UserId: userId,
        });

        const ExpInc = 6;
        const lll = Exp.Level;

        const ConditionDec = Math.floor(Math.random() * 15) + 10;
        const CarLevel = await Car.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          {
            $inc: {
              Money: MoneyInc,
              Exp: ExpInc,
              ConditionNumber: -ConditionDec,
            },
          },
          { upsert: false, new: true }
        );
        const CarCond = await Car.findOne({
          ChatId: chatId,
          UserId: userId,
        });

        if (CarCond.ConditionNumber <= 0) {
          msg.send("О нет! Ваша некруха сломалась!");
          const ZeroNumber = 0;
          const Broke = await Car.findOneAndUpdate(
            { ChatId: chatId, UserId: userId },
            { ConditionNumber: ZeroNumber, Condition: "Нужен ремонт" },
            {
              upsert: false,
              new: true,
            }
          );
        }

        const Zero = 0;
        const TypeWork = await Info.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          { WorkVar: Zero },
          { upsert: false, new: true }
        );
        console.log("Level: ", CarLevel);
        const nextLevelExperience = (CarLevel.Level + 5) * 2;
        if (CarLevel.Exp < nextLevelExperience) {
          msg.send(`Отличная работа!\n+${MoneyInc}💵 \n+6🏁`);
        }
        if (CarLevel.Exp >= nextLevelExperience) {
          const LevelUp = lll + 1;
          const Inc = CarLevel.Exp - nextLevelExperience;

          const sCar = await Car.findOneAndUpdate(
            { ChatId: chatId, UserId: userId },
            { Level: LevelUp, Exp: Inc },
            { upsert: true, new: true }
          );
          msg.send(`Отличная работа!\n+${MoneyInc}💵 \n+6🏁`);
          const name = sCar.Name;

          msg.send(`Некруха ${name} получает новый уровень!`);
        }
      }
    }
  } else {
    msg.send("Вы уже на работе!");
  }
});
bot.hear(/Гараж$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  // let keyboard;
  //ПРОВЕРКА НАЛИЧИЯ НЕКРУХИ
  const NewDate = new Date();
  const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });
  const CarInfo = await Info.findOne({ ChatId: chatId, UserId: userId });
  console.log(CarDB.Condition);
  let MessageText;
  let Condition = CarDB.Condition;
  let Parts = CarInfo.ZapParts;
  if (Condition === "На ходу") {
    keyboard = Keyboard.builder()

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    MessageText = `На ходу(${CarDB.ConditionNumber})`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts < 1 &&
    CarInfo.AutoServiceStatus == false
  ) {
    keyboard = Keyboard.builder()
      .row()
      .textButton({
        label: "Найти запчасти",
        payload: { command: "Найти запчасти" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    MessageText = `Нужен ремонт!`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts >= 1 &&
    CarInfo.AutoServiceStatus == false
  ) {
    keyboard = Keyboard.builder()
      .row()
      .textButton({
        label: "Отремонтировать некруху",
        payload: { command: "Отремонтировать некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Найти запчасти",
        payload: { command: "Найти запчасти" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    MessageText = `Нужен ремонт!`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts < 1 &&
    CarInfo.AutoServiceStatus == true &&
    CarInfo.AutoServiceTime < NewDate
  ) {
    keyboard = Keyboard.builder()
      .row()

      .textButton({
        label: "Забрать некруху",
        payload: { command: "Забрать некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .oneTime();

    MessageText = `Можно забрать некруху!`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts < 1 &&
    CarInfo.AutoServiceStatus == true &&
    CarInfo.AutoServiceTime > NewDate
  ) {
    keyboard = Keyboard.builder()

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    MessageText = `Некруха на ремонте в автосервисе.`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts >= 1 &&
    CarInfo.AutoServiceStatus == true &&
    CarInfo.AutoServiceTime < NewDate
  ) {
    keyboard = Keyboard.builder()
      .row()

      .textButton({
        label: "Забрать некруху",
        payload: { command: "Забрать некруху" },
        color: Keyboard.POSITIVE_COLOR,
      })

      .oneTime();

    MessageText = `Можно забрать некруху!`;
  } else if (
    Condition === "Нужен ремонт" &&
    Parts >= 1 &&
    CarInfo.AutoServiceStatus == true &&
    CarInfo.AutoServiceTime > NewDate
  ) {
    keyboard = Keyboard.builder()

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    MessageText = `Некруха на ремонте в автосервисе.`;
  }
  console.log(MessageText);
  // Поменять фото гаража
  const Items = await Info.findOne({
    ChatId: chatId,
    UserId: userId,
  });

  const photo = "photo-218124566_457239047";
  msg.send({
    message: `🛠Состояние: ${MessageText}\n \n📦Запчасти: ${Items.ZapParts}\n💈Баллончики с краской: ${Items.PaintBallon}`,
    keyboard: keyboard,
    attachment: photo,
  });
});

bot.hear(/Найти запчасти$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  let keyboard = Keyboard.builder()
    .row()
    .textButton({
      label: "Отдать в автосервис",
      payload: { command: "Отдать в автосервис" },
      color: Keyboard.POSITIVE_COLOR,
    })
    .row()
    .textButton({
      label: "Моя некруха",
      payload: { command: "Моя некруха" },
      color: Keyboard.SECONDARY_COLOR,
    })
    .inline()
    .oneTime();

  const Price = await Info.findOne({ ChatId: chatId, UserId: userId });
  let Repair = Price.RepairPrice;
  console.log("Цена ремонта:", Repair);
  if (Repair == 0) {
    let PriceResult = Math.floor(Math.random() * 65) + 99;
    const UpdateDB = await Info.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { RepairPrice: PriceResult }
    );
  }

  // const photo = "photo-218124566_457239047";
  msg.send({
    message: `Стоимость: ${Repair}💵 \nВремя ремонта: 2 мин.`,
    keyboard: keyboard,
    // attachment: photo,
  });
});

bot.hear(/Отдать в автосервис$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const Price = await Info.findOne({ ChatId: chatId, UserId: userId });
  let Repair = Price.RepairPrice;
  const MoneyExist = await Car.findOne({ ChatId: chatId, UserId: userId });
  let Money = MoneyExist.Money;
  if (Money >= Repair) {
    const DecMoney = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      {
        $inc: { Money: -Repair },
      }
    );

    const TimeNow = new Date() * 1;
    const TimeThen = TimeNow + 60000;

    // let LastTime = TimeLast.TimeToWork.getTime();

    const TimeAutoServ = await Info.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      {
        AutoServiceTime: TimeThen,
        AutoServiceStatus: true,
      }
    );

    msg.send({
      message: `Вы отдали некруху в сервис.`,
      // keyboard: keyboard,
      // attachment: photo,
    });
  } else {
    msg.send("У вас недостаточно денег!");
  }
});

bot.hear(/Забрать некруху$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const Price = await Info.findOne({ ChatId: chatId, UserId: userId });
  //  const Money = await Car.findOne({ ChatId: chatId, UserId: userId });
  let NewDate = new Date() * 1;
  if (Price.AutoServiceTime < NewDate && Price.AutoServiceStatus == true) {
    let number = 100;
    let Zero = 0;
    const Money = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { Condition: "На ходу", ConditionNumber: number }
    );
    const CarInfo = await Info.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      {
        RepairPrice: Zero,
        AutoServiceStatus: false,
      }
    );

    msg.send(`Некруха ${Money.Name} снова на ходу!`);
  } else if (Price.AutoServiceTime > NewDate) {
    msg.send(`Ваша некруха еще не готова!`);
  } else if (Price.AutoServiceStatus == false) {
    msg.send(`Ваша некруха вне автосервиса!`);
  }
});

// bot.hear(/Принадлежности$/i, async (msg) => {
//   const userId = msg.senderId;
//   const chatId = msg.peerId;

//   const Prinadlezhnosti = await Info.findOne({
//     ChatId: chatId,
//     UserId: userId,
//   });
//   const keyboard = Keyboard.builder()

//     .row()
//     .textButton({
//       label: "Моя некруха",
//       payload: { command: "Моя некруха" },
//       color: Keyboard.SECONDARY_COLOR,
//     })
//     .inline()
//     .oneTime();

//   const oCar = await Car.findOne({ ChatId: chatId, UserId: userId });
//   const photo = "photo-218124566_457239046";
//   msg.send({
//     message: `Принадлежности некрухи ${oCar.Name}: \n \nОригинальная канистра: ${Prinadlezhnosti.Kanistra}\nНабор ключей: ${Prinadlezhnosti.Keys}\nАптечка: ${Prinadlezhnosti.FirstAid}`,
//     keyboard: keyboard,
//     attachment: photo,
//   });
// });

// bot.hear(/Оснащение$/i, async (msg) => {
//   const userId = msg.senderId;
//   const chatId = msg.peerId;

//   // ПРОВЕРКА НАЛИЧИЯ НЕКРУХИ
//   const Equipment = await Info.findOne({ ChatId: chatId, UserId: userId });

//   const keyboard = Keyboard.builder()

//     .row()
//     .textButton({
//       label: "Моя некруха",
//       payload: { command: "Моя некруха" },
//       color: Keyboard.SECONDARY_COLOR,
//     })
//     .inline()
//     .oneTime();
//   const oCar = await Car.findOne({ ChatId: chatId, UserId: userId });

//   const photo = "photo-218124566_457239045";
//   msg.send({
//     message: `Оснащение некрухи ${oCar.Name}: \n \nДвигатель: ${Equipment.Engine}\nПодвеска: ${Equipment.Suspension}\nОбвесы: ${Equipment.Bumpers}\nКондиционер: ${Equipment.Conditioner}\nСалон: ${Equipment.Saloon}\nФары: ${Equipment.Headlights}\nФонари: ${Equipment.Taillights}\nРуль: ${Equipment.SteeringWheel}\nВонючка "Ёлочка": ${Equipment.StinkyTree}`,
//     keyboard: keyboard,
//     attachment: photo,
//   });
// });

// bot.hear(/Отремонтировать некруху$/i, async (msg) => {
//   const userId = msg.senderId;
//   const chatId = msg.peerId;
//   const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });
//   // const Money = await Car.findOne({
//   //   СhatId: chatId,
//   //   UserId: userId,
//   //   Money: { $gte: 50 },
//   // });
//   if (CarDB.Money < 50) {
//     msg.send("У Вас нет денег на ремонт!");
//   } else if (CarDB.Condition === "На ходу") {
//     msg.send("Ремонт не нужен, Ваша некруха еще походит!");
//     console.log("Money.Condition: ", Money.Condition);
//   } else {
//     // Снимаем деньги за ремонт и ремонтируем некруху
//     const RepairPrice = 50;
//     const Number = 100;
//     const PayToRace = await Car.findOneAndUpdate(
//       {
//         ChatId: chatId,
//         UserId: userId,
//       },
//       {
//         $inc: { Money: -RepairPrice },
//         ConditionNumber: Number,
//         Condition: "На ходу",
//       }
//     );
//     msg.send(`Некруха ${CarDB.Name} снова на ходу!`);
//   }
// });

bot.hear(/Гонка$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const keyboard = Keyboard.builder()
    .row()
    .textButton({
      label: "Регистрация",
      payload: { command: "Регистрация" },
      color: Keyboard.POSITIVE_COLOR,
    })
    .row()
    .textButton({
      label: "Начать гонку",
      payload: { command: "Начать гонку" },
      color: Keyboard.NEGATIVE_COLOR,
    })

    .row()
    .textButton({
      label: "Моя некруха",
      payload: { command: "Моя некруха" },
      color: Keyboard.SECONDARY_COLOR,
    })
    .inline()
    .oneTime();

  //найти подходящее фото для вкладки "гонка"
  const photoUrl = "photo-218124566_457239022";

  msg.send({
    message: `Для участия в гонке нажмите "Регистрация". Стоимость участия 50$, победитель забирает кассу.\n Нажмите "Начать гонку", чтобы начать гонку.\n  Гонка начнется автоматически, когда наберется 5 участников.`,
    keyboard: keyboard,
    attachment: photoUrl,
  });
});

bot.hear(/Регистрация$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const User = await Info.findOne({
    ChatId: chatId,
    UserId: userId,
    StatusRace: true,
  });
  // Проверяем, был ли пользователь уже зарегистрирован для игры
  if (User && User.StatusRace == true) {
    msg.send("Вы уже зарегистрированы для участия в гонке.");
  } else {
    const Money = await Car.findOne({
      СhatId: chatId,
      UserId: userId,
      Money: { $gte: 50 },
    });
    if (!Money) {
      msg.send("У Вас недостаточно денег!");
    } else if (Money.Condition === "Нужен ремонт") {
      msg.send("Ваша некруха не на ходу!");
    } else {
      // Регистрируем пользователя для игры
      const bet = 50;
      console.log("userId:" + userId + "  chatId" + chatId);
      const PayToRace = await Car.findOneAndUpdate(
        {
          ChatId: chatId,
          UserId: userId,
        },
        { $inc: { Money: -bet } }
      );
      console.log("PayToRace" + PayToRace);
      const RegToRace = await Info.findOneAndUpdate(
        {
          ChatId: chatId,
          UserId: userId,
        },
        { StatusRace: true }
      );
      console.log("RegToRace" + RegToRace);
      const CountExist = await RaceCount.findOne({
        ChatId: chatId,
      });
      if (!CountExist) {
        let Number = 0;
        const CountOfRacers = await RaceCount.create({
          NumberOfRacers: Number,
          ChatId: chatId,
        });
      }
      let AddOne = 1;
      const AddRacer = await RaceCount.findOneAndUpdate({
        $inc: { NumberOfRacers: AddOne },
        ChatId: chatId,
      });

      msg.send("Вы зарегистрированы. Ждем остальных исполнителей.");
    }
  }
});
bot.hear(/Начать гонку/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CountRacers = await RaceCount.findOne({
    ChatId: chatId,
  });
  if (CountRacers == "null") {
    msg.send("Никто не участвует в гонке!");
  }
  if (CountRacers && CountRacers.NumberOfRacers === 1) {
    msg.send("Зарегистрировался только один участник!");
  }

  if (CountRacers && CountRacers.NumberOfRacers > 1) {
    const result = await Info.find({
      ChatId: chatId,
      StatusRace: true,
    });

    // setTimeout(async () => {
    //здесь нужно выбрать случайный элемент из массива result, чтобы определить победителя
    let RaceWinner = Math.floor(Math.random() * result.length);

    let Winner = result[RaceWinner];
    console.log("RESULT" + Winner);
    const WinnerName = Winner.UserId;
    const WinnerResult = await Car.findOne({
      ChatId: chatId,
      UserId: WinnerName,
    });
    const Coefficent = CountRacers.NumberOfRacers;
    const WinSum = 50 * Coefficent;
    msg.send(
      `Победитель гонки - ${WinnerResult.Name}, Выигрыш составил - ${WinSum}$`
    );

    const MoneyWin = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { $inc: { Money: WinSum } }
    );
    const DeleteCount = await RaceCount.findOneAndDelete({
      ChatId: chatId,
    });
    const DeleteStatusRace = await Info.updateMany(
      {
        ChatId: chatId,
        StatusRace: true,
      },
      { StatusRace: false }
    );
    // }, 5000);
  }
});

// bot.hear(/^Капсула помощь$/i, async (msg) => {
//   msg.send(
//     `Список текстовых команд:\n \nХочу некруху\nВзять некруху\nДать некрухе имя\nЗавершить работу\nРулетка\nУйти со светофора\nСдать некруху\n \nОстальные команды на кнопках\n \n"Клуб" и "Музей" пока не созданы \n \n \nГлюки присутствуют) \nКапсула бот v0.9 =)`
//   );
// });

// bot.hear(/Моя некруха/i, (msg) => {
//   if (msg.isOutbox) return;
//   const car = await Car.findOne({ ObjectId: msg.senderId });
//   msg.send(
//     `🚗Модель: ${idCar.Name}\n 🏆Уровень: ${idCar.Level}\n ⚙Состояние: ${idCar.Health}\n ⚠Масло: ${idCar.Oil}\n ⛽Топливо: ${idCar.Fuel}\n 💵Деньги: ${idCar.Money}\n`
//   );
// });

// vk.updates.on("message", async (context, next) => {
//   if (context.payload && context.payload.command === "Инфо") {
//     // код, который должен выполниться при нажатии на кнопку
//     console.log("Кнопка 'Некруха Инфо' нажата!");
//   }
//   await next();
// });

bot.hear(/^Рулетка/gi, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const regex = /^Рулетка (.+)/i;
  const match = regex.exec(msg.text);
  console.log(match);
  if (match == null) {
    msg.send(`Примеры ставки:
     \n"Рулетка 50 красное" - ставка 50$ на цвет, \n"рулетка 50 22" - ставка 50$ на число 22.`);
    return;
  }
  if (match) {
    const args = match[1].split(" ");
    let playerBet = args[0];
    let playerChoice = args[1];
    console.log(playerBet);
    if (!playerChoice) {
      msg.send(`Введите корректную ставку. Примеры ставки:
       \n"Рулетка 50 красное" - ставка 50$ на цвет, \n"рулетка 50 22" - ставка 50$ на число 22.`);
      return;
    }
    const balance = await Car.findOne({ ChatId: chatId, UserId: userId });
    if (!balance) {
      msg.send("У Вас нет некрухи! Казино недоступно!");
    } else if (playerBet <= 0) {
      msg.send("Ваша ставка должна быть больше 0$!");
    } else if (playerBet === "-") {
      msg.send(`Введите корректную ставку. Примеры ставки:
       \n"Рулетка 50 красное" - ставка 50$ на цвет, \n"рулетка 50 22" - ставка 50$ на число 22.`);
    } else if (playerBet <= balance.Money) {
      playerBet = parseFloat(playerBet);
      console.log(playerBet);
      const DecrBet = await Car.findOneAndUpdate(
        {
          ChatId: chatId,
          UserId: userId,
        },
        { $inc: { Money: -playerBet } },
        { new: true }
      );

      // bot.sendMessage(
      //   chatId,
      //   `You've placed a bet of ${playerBet} on ${playerChoice}. Good luck!`
      // );

      const number = Math.floor(Math.random() * 37); // 0-36
      let color = "";
      if (number === 0) {
        color = "зеленое";
      } else if (number % 2 === 0) {
        color = "черное";
      } else {
        color = "красное";
      }

      let resultMessage = `Выпало ${number} ${color}. `;
      if (playerChoice === color) {
        playerBet = playerBet * 2;
        const Win = await Car.findOneAndUpdate(
          {
            ChatId: chatId,
            UserId: userId,
          },
          { $inc: { Money: playerBet } },
          { new: true }
        );
        resultMessage += `\nВы выйграли ${playerBet}💵 😃 \nВаш счет ${
          balance.Money + playerBet / 2
        }💵`;
      } else if (playerChoice == number) {
        playerBet = playerBet * 36;
        const Win = await Car.findOneAndUpdate(
          {
            ChatId: chatId,
            UserId: userId,
          },
          { $inc: { Money: playerBet } },
          { new: true }
        );
        resultMessage += `🤪 Вау!!! Вы выйграли ${playerBet}$!👍 Поздравляем!`;
      } else {
        resultMessage += `\nВы проиграли ${playerBet}💵 😱 \nВаш счет ${
          balance.Money - playerBet
        }💵`;
      }
      // msg.send(resultMessage);

      // const pictureRoulette = "photo-218124566_457239030";
      msg.send({
        message: resultMessage,

        // attachment: pictureRoulette,
      });
    } else {
      msg.send("У Вас не хватает денег для этой ставки.");
    }
  }
});
bot.hear(/БМВ фест$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  // let keyboard;
  const check = await Car.findOne({ ChatId: chatId, UserId: userId });
  if (!check) {
    msg.send("У Вас нет некрухи! :(");
  } else {
    keyboard = new KeyboardBuilder()
      .row()
      .textButton({
        label: "Задуть арочку",
        payload: { command: "Задуть арочку" },
        color: Keyboard.POSITIVE_COLOR,
      })
      .row()
      .textButton({
        label: "Отправиться на фест",
        payload: { command: "Отправиться на фест" },
        color: Keyboard.NEGATIVE_COLOR,
      })

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })
      .inline()
      .oneTime();

    const photo = "photo-218124566_457239031";

    msg.send({
      message: `Хочешь задуть арочку и отправиться на биммер-фест?\nЗадувай и езжай!\nС тебя 50$ за арку и 10⛽ на дорогу.\n`,
      keyboard: keyboard,
      attachment: photo,
    });
  }
});
bot.hear(/Задуть арочку$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const CheckArc = await Time.findOne({ ChatId: chatId, UserId: userId });
  let Check = CheckArc.StatusArc;
  console.log(Check);
  if (Check) {
    msg.send("Ваша арка еще походит!\nМожно на фест!");
  } else if (!Check) {
    const MoneyCheck = await Car.findOne({ ChatId: chatId, UserId: userId });
    let Money = MoneyCheck.Money;
    console.log(Money);
    if (Money < 50) {
      msg.send("У тебя не хватает денег!");
    } else {
      const Arc = "Еще походит";
      const MoneyPayFest = await Car.findOneAndUpdate(
        {
          ChatId: chatId,
          UserId: userId,
        },
        { $inc: { Money: -50 }, Health: Arc }
      );
      setTimeout(async () => {
        const Arc = "Нужна покраска";
        const ArcPaint = await Car.findOneAndUpdate(
          { ChatId: chatId, UserId: userId },
          {
            Health: Arc,
          }
        );
        msg.send(`О нет! У некрухи ${ArcPaint.Name} опять зацвела арка! :(`);
      }, 5 * 60 * 1000);

      msg.send(
        "Готово! Арка как новая! Но гарантия до ворот, так что поторопись!"
      );
    }
  }
});
bot.hear(/Отправиться на фест$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const Check = await Car.findOne({ ChatId: chatId, UserId: userId });
  const CheckT = await Time.findOne({ ChatId: chatId, UserId: userId });
  let CheckArc = Check.Health;
  let CheckTime = CheckT.FestTime;
  console.log(CheckArc, CheckTime);
  let TimeNoww = new Date();
  if (CheckArc === "Нужна покраска" && CheckT.FestTime.getTime() < TimeNoww) {
    msg.send("Куда ты собрался с ржавой аркой? Подкрась некруху!");
  } else if (Check.Fuel < 10) {
    msg.send("У тебя недостаточно топлива на дорогу!");
  } else if (
    CheckArc === "Еще походит" &&
    CheckT.FestTime.getTime() < TimeNoww
  ) {
    const TimeLast = await Time.findOne({ ChatId: chatId, UserId: userId });

    const TimeNow = new Date() * 1;
    console.log("last: ", TimeLast.FestTime.getTime());
    console.log("now:", TimeNow);
    const Status = TimeLast.StatusArc;

    const TimeThen = TimeNow + 1500000;
    const idTime = await Time.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { FestTime: TimeThen, StatusArc: true },
      { upsert: true, new: true }
    );
    console.log(TimeThen);
    const FestPhoto = "photo-218124566_457239032";
    msg.send({
      message: `Крутой вышел фест! ${Check.Name} - настоящая капсула времени!\n +10🏁 опыта!`,
      attachment: FestPhoto,
    });
    const FuelInc = 10;

    const ExpInc = 10;
    const lll = Check.Level;

    const CarLevel = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { $inc: { Fuel: -FuelInc, Exp: ExpInc } },
      { upsert: false, new: true }
    );
    const nextLevelExperience = (CarLevel.Level + 5) * 2;
    if (CarLevel.Exp >= nextLevelExperience) {
      const LevelUp = lll + 1;
      const Inc = CarLevel.Exp - nextLevelExperience;

      const sCar = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { Level: LevelUp, Exp: Inc },
        { upsert: false, new: true }
      );
      msg.send(`Эй, некруха ${sCar.Name} получает новый уровень!`);
    }
  } else if (CheckT.FestTime.getTime() > TimeNoww) {
    msg.send("Ваша некруха сегодня уже была на фесте!");
  }
});

bot.hear(/^Рома гей$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  let Sum = 100;
  const SecretCommand = await Car.findOneAndUpdate(
    { ChatId: chatId, UserId: userId },
    { $inc: { Money: Sum } }
  );
  msg.send(`${SecretCommand.Name} + $100`);
});
bot.hear(/^Василий топ$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  let Sum = 100;
  const SecretCommand = await Car.findOneAndUpdate(
    { ChatId: chatId, UserId: userId },
    { $inc: { Money: Sum } }
  );
  msg.send(`${SecretCommand.Name} + $100`);
});

bot.hear(/^Уйти со светофора$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;

  const Check = await Car.findOne({ ChatId: chatId, UserId: userId });
  const CheckT = await Info.findOne({ ChatId: chatId, UserId: userId });
  let CheckCondition = Check.Condition;
  let CheckTime = CheckT.TimeToUnderground;
  console.log(CheckCondition, CheckTime);
  let TimeNoww = new Date();
  if (
    CheckCondition === "Нужен ремонт" &&
    CheckT.TimeToUnderground.getTime() < TimeNoww
  ) {
    msg.send("Ваша некруха не на ходу!");
  } else if (Check.Fuel < 5) {
    msg.send("У Вас недостаточно ⛽!");
  } else if (
    CheckCondition === "На ходу" &&
    CheckT.TimeToUnderground.getTime() < TimeNoww
  ) {
    const TimeLast = await Time.findOne({ ChatId: chatId, UserId: userId });

    const TimeNow = new Date() * 1;
    console.log("last: ", TimeLast.FestTime.getTime());
    console.log("now:", TimeNow);

    const TimeThen = TimeNow + 7200000;
    const idTime = await Time.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { TimeToUnderground: TimeThen },
      { upsert: false, new: true }
    );
    const Fuel = 5;
    const idCar = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { $inc: { Fuel: -Fuel } },
      { upsert: false, new: true }
    );
    console.log(TimeThen);
    const keyboard = Keyboard.builder()

      .row()
      .textButton({
        label: "Моя некруха",
        payload: { command: "Моя некруха" },
        color: Keyboard.SECONDARY_COLOR,
      })

      .oneTime();
    const RacePhoto = "photo-218124566_457239034"; // ФОТО УХОДА СО СВЕТОФОРА(лучше рандомно 1 из нескольких)
    msg.send({
      message: `Когда зажигается зеленый свет, все забывается, кроме рева мотора и запаха жженой резины...\nВы ушли со светофора. \n-5⛽ \n +3🏁`,
      keyboard: keyboard,
      attachment: RacePhoto,
    });

    const ExpInc = 3;
    const lll = Check.Level;

    const CarLevel = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      { $inc: { Exp: ExpInc } },
      { upsert: false, new: true }
    );
    const nextLevelExperience = (CarLevel.Level + 5) * 2;
    if (CarLevel.Exp >= nextLevelExperience) {
      const LevelUp = lll + 1;
      const Inc = CarLevel.Exp - nextLevelExperience;

      const sCar = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { Level: LevelUp, Exp: Inc },
        { upsert: false, new: true }
      );
      msg.send(`Некруха ${sCar.Name} получает новый уровень!`);
    }
  } else if (CheckT.TimeToUnderground.getTime() > TimeNoww) {
    msg.send(
      "Ваша некруха перегрелась в предыдущем заезде со светофора! Ей нужно остыть, перерыв 2 часа!"
    );
  }
});

bot.hear(/^Некруха дня$/i, async (msg) => {
  // const userId = msg.senderId;
  const chatId = msg.peerId;

  const DailyDate = await NecroDaily.findOne({
    ChatId: chatId,
  });

  if (!DailyDate) {
    // запрашиваем бд и выбираем случайного пользователя
    const randomCar = await Car.find({ ChatId: chatId });
    console.log("randomCar: ", randomCar);

    let result = Math.floor(Math.random() * randomCar.length);
    let CarOfTheDay = randomCar[result];

    console.log("CarOfTheDay: ", CarOfTheDay);
    console.log("result: ", result);
    const userId = CarOfTheDay.UserId;
    console.log("userId: ", userId);

    const DailyDate = await NecroDaily.create({
      Daily: new Date(),
      Date: new Date(),
      Friday: new Date(),
      ChatId: chatId,

      UserId: userId, //случайно выбранная на сегодня - записываем
    });

    const BonusDaily = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      {
        $inc: { Money: 50, Fuel: 10, Exp: 5 },
      }, // начисляем бонус
      { upsert: false, new: true }
    );

    msg.send(`Сегодня самая крутая некруха - ${BonusDaily.Name}! \nОна получает: \n+ 50$ \n+ 10л \n+5 Exp
    `); // отправляем сообщение
    const CarLevel = await Car.findOne({ ChatId: chatId, UserId: userId });
    const nextLevelExperience = (CarLevel.Level + 5) * 2;
    if (CarLevel.Exp >= nextLevelExperience) {
      const lll = CarLevel.Level;
      const LevelUp = lll + 1;
      const Inc = CarLevel.Exp - nextLevelExperience;

      const sCar = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { Level: LevelUp, Exp: Inc },
        { upsert: false, new: true }
      );
      msg.send(`Некруха ${sCar.Name} получает новый уровень!`);
    }
  } else {
    const randomCar = await Car.find({ ChatId: chatId });
    console.log("randomCar: ", randomCar);

    let result = Math.floor(Math.random() * randomCar.length);
    let CarOfTheDay = randomCar[result];

    console.log("CarOfTheDay: ", CarOfTheDay);
    console.log("result: ", result);
    const userId = CarOfTheDay.UserId;
    console.log("userId: ", userId);

    // const result = await Info.find({
    //   ChatId: chatId,
    //   StatusRace: true,
    // });

    // // setTimeout(async () => {
    // //здесь нужно выбрать случайный элемент из массива result, чтобы определить победителя
    // let RaceWinner = Math.floor(Math.random() * result.length);

    // let Winner = result[RaceWinner];
    // console.log("RESULT" + Winner);
    // const WinnerName = Winner.UserId;

    const Daily = await NecroDaily.findOneAndUpdate(
      {
        ChatId: chatId,
      },
      {
        UserId: userId, //случайно выбранная на сегодня - записываем
      }
    );

    const BonusDaily = await Car.findOneAndUpdate(
      { ChatId: chatId, UserId: userId },
      {
        $inc: { Money: 50, Fuel: 10, Exp: 5 }, // начисляем бонус
      },
      { upsert: false, new: true }
    );

    msg.send(`Сегодня самая крутая некруха - ${BonusDaily.Name}! \nОна получает: \n+ 50$ \n+ 10л \n+5 Exp
`);
    const CarLevel = await Car.findOne({ ChatId: chatId, UserId: userId });
    const nextLevelExperience = (CarLevel.Level + 5) * 2;
    if (CarLevel.Exp >= nextLevelExperience) {
      const lll = CarLevel.Level;
      const LevelUp = lll + 1;
      const Inc = CarLevel.Exp - nextLevelExperience;

      const sCar = await Car.findOneAndUpdate(
        { ChatId: chatId, UserId: userId },
        { Level: LevelUp, Exp: Inc },
        { upsert: false, new: true }
      );
      msg.send(`Некруха ${sCar.Name} получает новый уровень!`);
    }
  }
});

bot.hear(/^Приобрести запчасти$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });

  if (CarDB.Money < 50) {
    msg.send("У Вас не хватает денег!");
  } else {
    // Снимаем деньги и начисляем +1 запчасть в инвентарь
    const PartsPrice = 50;
    const Number = 1;
    const PayForParts = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { Money: -PartsPrice },
      }
    );
    const PartsInc = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { ZapParts: Number },
      }
    );

    msg.send(`Вы приобрели 1 запчасть!`);
  }
});

bot.hear(/^Продать запчасти$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const InfoDB = await Info.findOne({ ChatId: chatId, UserId: userId });

  if (InfoDB.ZapParts < 1) {
    msg.send("У Вас нет запчастей в инвентаре!");
  } else {
    // Продаем 1 запчасть из инвентаря
    const PartsPrice = 25;
    const Number = 1;
    const MoneyForSellParts = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { Money: PartsPrice },
      }
    );
    const PartsDec = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { ZapParts: -Number },
      }
    );

    msg.send(`Вы продали 1 запчасть за 25$!`);
  }
});

bot.hear(/^Приобрести краску$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });

  if (CarDB.Money < 50) {
    msg.send("У Вас не хватает денег!");
  } else {
    // Снимаем деньги и начисляем +1 краску в инвентарь
    const PaintPrice = 50;
    const Number = 1;
    const PayForParts = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { Money: -PaintPrice },
      }
    );
    const PartsInc = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { PaintBallon: Number },
      }
    );

    msg.send(`Вы приобрели 1 баллончик краски!`);
  }
});

bot.hear(/^Продать краску$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const InfoDB = await Info.findOne({ ChatId: chatId, UserId: userId });

  if (InfoDB.PaintBallon < 1) {
    msg.send("У Вас нет баллончиков краски в инвентаре!");
  } else {
    // Продаем 1 запчасть из инвентаря
    const PaintSellPrice = 25;
    const Number = 1;
    const MoneyForSellParts = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { Money: PaintSellPrice },
      }
    );
    const PaintDec = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { PaintBallon: -Number },
      }
    );

    msg.send(`Вы продали 1 баллончик краски за 25$!`);
  }
});

bot.hear(/Отремонтировать некруху$/, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });
  const InfoDB = await Info.findOne({ ChatId: chatId, UserId: userId });

  if (CarDB.Condition === "На ходу") {
    msg.send("Ремонт не нужен, Ваша некруха еще походит!");
    console.log("Money.Condition: ", Money.Condition);
  } else if (InfoDB.ZapParts < 1) {
    msg.send("У Вас нет запчастей в инвентаре!");
  } else {
    // Снимаем 1 запчасть и ремонтируем некруху
    const RepairParts = 1;
    const Number = 100;
    const PayToRace = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        // $inc: { Money: -RepairPrice },
        ConditionNumber: Number,
        Condition: "На ходу",
      }
    );
    const PartsDec = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { ZapParts: -RepairParts },
      }
    );

    msg.send(`Некруха ${CarDB.Name} снова на ходу!`);
  }
});

bot.hear(/^Использовать краску$/i, async (msg) => {
  const userId = msg.senderId;
  const chatId = msg.peerId;
  const CarDB = await Car.findOne({ ChatId: chatId, UserId: userId });
  const InfoDB = await Info.findOne({ ChatId: chatId, UserId: userId });

  if (CarDB.Health === "Еще походит") {
    msg.send("Ваши пороги в хорошем состоянии!");
    // console.log("Money.Condition: ", Money.Condition);
  } else if (InfoDB.PaintBallon < 1) {
    msg.send("У Вас нет краски в инвентаре!");
  } else {
    // Снимаем 1 баллончик краски и красим пороги
    const RepairPaint = 1;
    const GoodCondition = "Еще походит";
    const PayToRace = await Car.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        Health: GoodCondition,
      }
    );
    const PaintDec = await Info.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        $inc: { PaintBallon: -RepairPaint },
      }
    );
    const Paint = await Time.findOneAndUpdate(
      {
        ChatId: chatId,
        UserId: userId,
      },
      {
        StatusArc: true,
      }
    );

    msg.send(`Вы покрасили пороги!`);
  }
});

console.log("bot start!");
vk.updates.start().catch(console.error);
