const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Client } = require('pg')
const client = new Client()

await client.connect()


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Size {
    height: Int!
    width: Int!
  }
  union Any = Int | String | Size
  type Query {
    records: [Records]
  }
  type Records {
    name: String,
    timestamp: Long,
    record: [Record]
  }
  type Record {
    action: String,
    frameId: Int,
    frameUrl: String,
    value: Any,
    code: String,
    coordinates: String,
    href: String,
    key: String,
    keyCode: String,
    selector: String,
    tagName: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    records: 
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);