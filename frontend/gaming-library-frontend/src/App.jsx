import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './services/graphqlClient';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DashboardGraphQL from './components/DashboardGraphQL';
import GameDetail from './components/GameDetail';
import GraphQLTest from './components/GraphQLTest';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<DashboardGraphQL />} />
              <Route path="/rest-dashboard" element={<Dashboard />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/graphql-test" element={<GraphQLTest />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;