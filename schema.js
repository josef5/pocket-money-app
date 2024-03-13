exports.typeDefs = `

  scalar DateTime

  type Query {
    getCurrentUser: User
    getBalance: Float
    getHistory: [BankHistoryItem]
  }

  type Mutation {
    registerUser(username: String!, password: String!): Token
    signInUser(username: String!, password: String!): Token
    changePassword(username: String!, oldPassword: String!, newPassword: String!): Token
    setBalance(username: String!, newValue: Float!): Float
    updateBalance(username: String!, increment: Float!): Float
    autoUpdate: Float
  }

  type Token {
    token: String!
  }

  type User {
    _id: ID
    username: String! @unique
    password: String!
  }

  type Bank {
    balance: Float
    autoUpdateIncrement: Float
    lastAutoUpdate: DateTime
    payday: String
    history: [BankHistoryItem]
  }

  type BankHistoryItem {
    username: String!
    increment: Float!
    newBalance: Float!
    date: DateTime!
  }
`;
