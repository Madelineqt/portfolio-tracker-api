const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: [true, 'Stock must have a ticker'],
    },
    shares: {
      type: Number,
      required: [true, 'Stock must have a share number'],
    },
    price: {
      type: Number,
      required: [true, 'Stock must have a price']
    },
    bought: {
        type: String,
        required: [true, 'Stock must have a bought date']
      },
  },
);

const Stock = mongoose.model('stocks', stockSchema);

module.exports = {
  Stock
};