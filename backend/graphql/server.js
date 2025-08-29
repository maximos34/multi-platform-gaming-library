const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function startGraphQLServer(app, httpServer) {
  // Create schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  
  // Start the server
  await server.start();
  
  // Set up Express middleware
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Get the user token from headers
        const token = req.headers.authorization || '';
        
        // Try to retrieve a user with the token
        let user = null;
        if (token.startsWith('Bearer ')) {
          try {
            const tokenString = token.substring(7);
            user = jwt.verify(tokenString, process.env.JWT_SECRET);
          } catch (error) {
            console.error('Invalid token:', error.message);
          }
        }
        
        // Add the user to the context
        return { user };
      },
    }),
  );
  
  console.log(`GraphQL Server ready at http://localhost:5000/graphql`);
}

module.exports = startGraphQLServer;