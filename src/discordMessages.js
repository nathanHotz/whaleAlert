const Discord = require("discord.js");

const exchangeURLs = require("./exchangeURLs");

const buildEmbedMessage = (whale) => {
  const amount = new Intl.NumberFormat().format(whale.amount);
  const dollarAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(whale.amount_usd);
  const fromOwner = whale.from.owner
    ? whale.from.owner + " (" + whale.from.owner_type + ")"
    : "Unknown Owner";

  const toOwner = whale.from.owner
    ? whale.to.owner + " (" + whale.to.owner_type + ")"
    : "Unknown Owner";

  return new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setAuthor("Whaley", "https://i.imgur.com/WOcU88N.jpg")
    .setTitle(`${amount} ${whale.symbol.toUpperCase()} (${dollarAmount})`)
    .setURL(`${exchangeURLs[whale.blockchain]}${whale.hash}`)
    .setThumbnail(
      `https://raw.githubusercontent.com/nathanHotz/iconsForMeToUse/main/128/color/${whale.symbol}.png`
    )
    .addFields(
      {
        name: "Blockchain",
        value: `${whale.blockchain.toUpperCase()}`,
        inline: true,
      },
      {
        name: "From",
        value: `${fromOwner}`,
        inline: true,
      },
      {
        name: "To",
        value: `${toOwner}`,
        inline: true,
      }
    )
    .setDescription(
      `${amount} ${whale.symbol.toUpperCase()} (${dollarAmount}) on the ${
        whale.blockchain
      } blockchain has been transferred.`
    )
    .setTimestamp()
    .setFooter(
      "Don't be dumb with this info.",
      "https://i.pinimg.com/236x/6a/08/a8/6a08a8bbe340252d55d6ab7dfe999507.jpg"
    );
};

const sendDiscordMessage = (client, whale) => {
  const embedMessage = buildEmbedMessage(whale);
  return new Promise(async (res) => {
    await client.send("", {
      embeds: [embedMessage],
    });

    res();
  });
};

module.exports = { sendDiscordMessage };
