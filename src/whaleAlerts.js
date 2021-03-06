const fetch = require("node-fetch");

const ONE_DAY = 24 * 60 * 60 * 1000;
const whaleTracker = new Map();

const getWhaleAlerts = () => {
  const tenSecondsAgo = Math.floor(new Date().getTime() / 1000 - 10);
  return new Promise(async (res) => {
    const url = `https://api.whale-alert.io/v1/transactions?start=${tenSecondsAgo}&min_value=5000000`;
    try {
      const resp = await fetch(url, {
        headers: {
          "X-WA-API-KEY": process.env.WHALE_ALERT_API,
        },
      });

      const body = await resp.text();
      res(JSON.parse(body));
    } catch (e) {
      res({});
    }
  });
};

const cleanWhaleTracker = () => {
  const now = new Date().getTime();
  whaleTracker.forEach((time, id) => {
    // if whale has been tracked for a day, remove it.
    if (time < now) {
      whaleTracker.delete(id);
    }
  });
};

const filterWhales = (whales) => {
  if (!whales.transactions) return [];

  const newWhales = whales.transactions.filter((whale) => {
    if (!whaleTracker.get(whale.id)) {
      const expirationTime = new Date().getTime() + ONE_DAY;
      whaleTracker.set(whale.id, expirationTime);
      return true;
    }
    return false;
  });

  cleanWhaleTracker();

  return [...newWhales];
};

module.exports = { getWhaleAlerts, filterWhales };
