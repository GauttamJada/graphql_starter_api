const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const app = express();

//Import MongoUI
const { MONGO_UI } = require("./config/database");

const Schema = require("./graphql/schema");
const Resolver = require("./graphql/resolvers");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api', graphqlHttp({
  schema: Schema,
  rootValue: Resolver,
  graphiql: true
}));

const port = process.env.PORT || 3000;

//Connecting to mongodb..................
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_UI, {
  useCreateIndex: true,
  useNewUrlParser: true
})
.then(res => app.listen(port, () => console.log(`server running on port ${port}!!`)))
.catch(err => {
  throw err;
});