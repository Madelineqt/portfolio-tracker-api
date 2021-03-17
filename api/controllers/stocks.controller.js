const yahooFinance = require("yahoo-finance");
const { Stock } = require("../models/stocks.model");

let stockController = {};

stockController.getOwnedStocks = () => {
  return Stock.find({});
};
stockController.getOwnedStock = ({ ticker }) => {
  return Stock.find({ ticker: ticker });
};
stockController.calculateProfitsByStocks = async (ownedStocks) => {
  const promises = [];
  ownedStocks.forEach(async (ownedStock, index) => {
    promises.push(stockController.getCurrentStockPrice(ownedStock));
  });
  const final = await Promise.all(promises).then((stats) => {
    const computedStocks = [];
    stats.forEach(async (stat, index) => {
      console.log(stat);
      const currentPrice = parseFloat(stat);
      const profit = await `${
        ownedStocks[index].price < currentPrice ? "+" : "-"
      }${stockController
        .relDiff(ownedStocks[index].price, currentPrice)
        .toFixed(2)}%`;
      computedStocks.push({
        ticker: ownedStocks[index].ticker,
        shares: ownedStocks[index].shares,
        price: ownedStocks[index].price,
        bought: ownedStocks[index].bought,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        profit: profit,
      });
    });
    return computedStocks;
  });
  return final;
};
stockController.calculateValueOverAllTime = async (ownedStocks) => {
    let earliestDate = new Date(stockController.earliestDate(ownedStocks.map((element) => element.bought)))
    earliestDate = new Date (earliestDate.setHours(0,0,0,0))
    let today = new Date()
    today = new Date(today.setHours(0,0,0,0))
    const promises = [];
    ownedStocks.forEach(async stock => {
        console.log({symbol:stock.ticker, from:stock.bought, to:today.toISOString().split('T')[0]})
        promises.push(stockController.getStocksInRange({symbol:stock.ticker, from:stock.bought, to:today.toISOString().split('T')[0]}))
    })
    const stockValues = await Promise.all(promises).then(values => {
        return values
    })
    console.log(stockValues)
    let currentDate = earliestDate
    while (currentDate < today) {
        const array = [].concat.apply([], stockValues.map((element) => element.filter(o => o.date.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0))));
        console.log(`Stock values for day ${currentDate.toISOString().split('T')[0]}` + array)
        console.log(`Total value for day ${currentDate.toISOString().split('T')[0]} ` + array.reduce((prev, cur) => prev + cur.open, 0).toFixed(2))
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }
    return stockValues
}
stockController.earliestDate = (dates) => {
    return dates.reduce((c, n) => Date.parse(n) < Date.parse(c) ? n : c);
} 
stockController.relDiff = (a, b) => {
  return 100 * Math.abs((a - b) / ((a + b) / 2));
};
stockController.addStocks = ({ ticker, shares, price, bought }) => {
  return new Stock({
    ticker: ticker,
    shares: shares,
    price: price,
    bought: bought,
  }).save();
};
stockController.getCurrentStockPrice = async ({ ticker }) => {
  const quote = await yahooFinance.quote(
    {
      symbol: ticker,
      modules: ["summaryDetail"],
    },
    function (err, quotes) {
      if (err) throw err;
      return quotes;
    }
  );
  return quote.summaryDetail.open;
};
stockController.getStocksInRange = async ({ symbol, from, to }) => {
  return await yahooFinance.historical(
    {
      symbol: symbol,
      from: from,
      to: to,
      period: "d",
    },
    function (err, quotes) {
      if (err) throw err;
      return quotes
    }
  );
};
stockController.getDividendsInRange = async ({ symbol, from, to }) => {
  return await yahooFinance.historical(
    {
      symbol: symbol,
      from: from,
      to: to,
      period: "v",
    },
    function (err, quotes) {
      if (err) throw err;
      return quotes;
    }
  );
};

module.exports = stockController;
