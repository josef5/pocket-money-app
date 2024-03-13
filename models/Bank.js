const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankHistoryItemSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  increment: {
    type: Number,
    required: true,
  },
  newBalance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const BankSchema = new Schema({
  balance: {
    type: Number,
    default: 0,
  },
  autoUpdateIncrement: {
    type: Number,
    default: 5,
  },
  lastAutoUpdate: {
    type: Date,
    default: Date.now,
  },
  payday: {
    type: String,
    default: 'Saturday',
  },
  history: [BankHistoryItemSchema],
});

module.exports = {
  Bank: mongoose.model('Bank', BankSchema),
  BankHistoryItem: mongoose.model('BankHistoryItem', BankHistoryItemSchema),
};
