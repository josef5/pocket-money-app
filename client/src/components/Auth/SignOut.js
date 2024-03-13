import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const handleSignOut = (client, history) => {
  localStorage.setItem('token', '');
  //localStorage.removeItem('token');

  client.resetStore();

  history.push('/');
};

const SignOut = ({ history }) => (
  <ApolloConsumer>
    {client => {
      return (
        <p
          className="nav-link sign-out"
          onClick={() => handleSignOut(client, history)}
        >
          Sign Out
        </p>
      );
    }}
  </ApolloConsumer>
);

export default withRouter(SignOut);
