const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const GraphQLDateTime = require('graphql-type-datetime');
const moment = require('moment');
require('moment-weekday-calc');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;

  return jwt.sign({ username, email }, secret, { expiresIn });
};

// Round to 2 decimal places
const currencyRound = value =>
  Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);

exports.resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    getCurrentUser: async (_, __, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }

      const user = await User.findOne({
        username: currentUser.username,
      });

      return user;
    },

    getBalance: async (_, __, { Bank }) => {
      let bank = await Bank.findOne();

      if (!bank) {
        bank = await new Bank().save();
      }

      return bank.balance;
    },
    getHistory: async (_, __, { Bank }) => {
      let bank = await Bank.findOne();

      if (!bank) {
        bank = await new Bank().save();
      }

      return bank.history;
    },
  },

  Mutation: {
    registerUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });

      if (user) {
        throw new Error('User already exists');
      }

      const newUser = await new User({
        username,
        password,
      }).save();

      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    },

    signInUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      return { token: createToken(user, process.env.SECRET, '1hr') };
    },

    changePassword: async (
      _,
      { username, newPassword, oldPassword },
      { User }
    ) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      if (oldPassword === newPassword) {
        throw new Error('New password is the same as the old one');
      }

      user.password = newPassword;

      await user.save();

      return { token: createToken(user, process.env.SECRET, '1hr') };
    },

    setBalance: async (
      _,
      { username, newValue },
      { Bank, BankHistoryItem }
    ) => {
      let bank = await Bank.findOne();

      if (!bank) {
        bank = new Bank();
        await bank.save(); // save defaults
      }

      const previousBalance = bank.balance;
      bank.balance = currencyRound(newValue);

      bank.history.push(
        new BankHistoryItem({
          increment: bank.balance - previousBalance,
          newBalance: bank.balance,
          username,
          date: Date.now(),
        })
      );

      bank.save();

      return bank.balance;
    },

    updateBalance: async (
      _,
      { username, increment },
      { Bank, BankHistoryItem }
    ) => {
      let bank = await Bank.findOne();

      if (!bank) {
        bank = new Bank();
        await bank.save(); // save defaults
      }

      // Round to 2 decimal places
      increment = currencyRound(increment);
      bank.balance = currencyRound(bank.balance);

      bank.balance += increment;

      bank.history.push(
        new BankHistoryItem({
          increment: increment,
          newBalance: bank.balance,
          username,
          date: Date.now(),
        })
      );

      await bank.save();

      return bank.balance;
    },

    autoUpdate: async (_, __, { Bank, BankHistoryItem }) => {
      let bank = await Bank.findOne();

      if (!bank) {
        bank = new Bank();
        await bank.save(); // save defaults
      }

      const now = moment();
      const lastAutoUpdate = moment(bank.lastAutoUpdate);
      const daysSinceLastAutoUpdate = now.diff(lastAutoUpdate, 'days');
      const lastUpdateWasToday = daysSinceLastAutoUpdate === 0;
      const paydayDayOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ].indexOf(bank.payday);

      // Add 1 day to exclude last auto update date
      let paydaysSinceLastAutoUpdate = lastAutoUpdate
        .clone()
        .add(1, 'day')
        .weekdayCalc(now, [paydayDayOfWeek]);

      // Don't include today
      if (lastUpdateWasToday) {
        paydaysSinceLastAutoUpdate = 0;
      }

      console.log('Last auto update:', lastAutoUpdate.format('YYYY-MM-DD'));
      console.log('Paydays since last auto update', paydaysSinceLastAutoUpdate);
      console.log({
        now: now.format('YYYY-MM-DD'),
        lastAutoUpdate: lastAutoUpdate.format('YYYY-MM-DD'),
        paydayDayOfWeek,
      });

      // A separate update for each payday
      for (let i = paydaysSinceLastAutoUpdate; i > 0; i--) {
        const payDate = now
          .clone()
          .startOf('day')
          .day(paydayDayOfWeek)
          .subtract(i, 'weeks');

        console.log(`payday ${i}: ${payDate}`);

        bank.balance += bank.autoUpdateIncrement;

        bank.history.push(
          new BankHistoryItem({
            increment: bank.autoUpdateIncrement,
            newBalance: bank.balance,
            username: 'Weekly Update',
            date: payDate,
          })
        );

        // Set to last update in loop
        if (i === 1) bank.lastAutoUpdate = payDate;
      }

      await bank.save();

      return bank.balance;
    },
  },
};
