const Router = require('express')
const stocks = require('./api/routes/stocks.routes')
const router = Router()
const mongoose = require('mongoose');
const logger = require('./helpers/logger/logger');
require('dotenv').config()


router.listen(process.env.PORT || 5000)
router.use(stocks)

mongoose.connect(process.env.MONGODB_URI, {
    // Estos settings apagan warnings de mongoose
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
mongoose.connection.on('error', (err) => {
logger.error('Falló la conexión a mongodb');
process.exit(1);
});

module.exports = router
