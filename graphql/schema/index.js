const { buildSchema } = require("graphql");


module.exports = buildSchema(`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    createdItems: [Item!]!
  }

  type Item {
    _id: ID!
    name: String!
    price: String!,
    creator: User!
  }

  input UserInput {
    name: String!
    email: String!,
    password: String!
  }

  input ItemInput {
    name: String!
    price: String!
    creatorId: String!
  }

  type RootQuery {
    users: [User!]!
    items: [Item!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    createItem(itemInput: ItemInput): Item
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);