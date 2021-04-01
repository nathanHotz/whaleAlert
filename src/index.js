require("dotenv").config();

const cron = require("node-cron");
const winston = require("winston");
const Discord = require("discord.js");

const { getWhaleAlerts, filterWhales } = require("./whaleAlerts");
const { sendDiscordMessage } = require("./discordMessages");

const webhookClient = new Discord.WebhookClient(
  process.env.DISCORD_WEBHOOK_ID,
  process.env.DISCORD_WEBHOOK_TOKEN
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "combined.log", maxsize: 1000000 }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const main = async () => {
  const spottedWhales = await getWhaleAlerts();

  logger.info(
    `Spotted ${
      spottedWhales.transactions ? spottedWhales.transactions.length : 0
    } whales`
  );

  const newWhales = filterWhales(spottedWhales);

  for (whale of newWhales) {
    await sendDiscordMessage(webhookClient, whale);
  }
};

logger.info("Starting service");

cron.schedule("*/6 * * * * *", () => {
  main();
});
