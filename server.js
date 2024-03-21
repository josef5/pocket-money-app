const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const { Bank, BankHistoryItem } = require('./models/Bank');

// Bring in GraphQL-Express middleware
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

mongoose.set('debug', true);

// Initialise application
const app = express();

const corsOptions = {
  origin: 'http://localhost:3333',
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors("*"));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];

  // when signed out, make sure we don't enter the if statement; i.e. such that token does not evaluate to true
  if (token && token !== 'null') {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      console.log('Current User:', currentUser);

      req.currentUser = currentUser;
    } catch (err) {
      console.log(err.message);
    }
  }

  next();
});

// Create GraphiQL application
if (process.env.NODE_ENV !== 'production')
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Connect schemas with GraphQL
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      User,
      currentUser,
      Bank,
      BankHistoryItem,
    },
  }))
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 5555;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
