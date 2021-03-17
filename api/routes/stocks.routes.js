const Router = require('express')
const bodyParser = require("body-parser");
const stockController = require('../controllers/stocks.controller')
const router = Router();

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.get("/api/getTodayOwnedStocks", async (req,res) => {
    const ownedStocks = await stockController.getOwnedStocks()
    const profits = await stockController.calculateProfitsByStocks(ownedStocks)
    res.send(profits)
})
router.get("/api/getOverTimeOwnedStocks", async (req,res) => {
    const ownedStocks = await stockController.getOwnedStocks()
    const profits = await stockController.calculateValueOverAllTime(ownedStocks)
    res.send(profits)
})
router.post("/api/getOwnedStock", async (req,res) => {
    const ownedStock = await stockController.getOwnedStock(req.body)
    res.send(ownedStock)
})
router.post("/api/addNewStock", async (req,res) => {
    const newStock = await stockController.addStocks(req.body)
    res.send(newStock)
})
router.get("/api/getRangeOfStocks", async (req,res) => {
    const stocks = await stockController.getStocksInRange({symbol:"VWAGY", from:"2021-03-01", to:"2021-03-17"})
    res.send(stocks)
})  

module.exports = router