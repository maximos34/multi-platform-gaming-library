import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_GAMES } from '../services/graphqlQueries';

const GraphQLTest = () => {
  const { loading, error, data } = useQuery(GET_GAMES, {
    variables: { limit: 10 }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>GraphQL Test - Games List</h2>
      <ul>
        {data.games.map(game => (
          <li key={game.id}>
            <strong>{game.title}</strong> - {game.platform}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphQLTest;