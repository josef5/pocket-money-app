import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App';
import Navbar from './components/Navigation/Navbar';
import withSession from './components/withSession';
import SignIn from './components/Auth/SignIn';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import BankHistory from './components/Bank/BankHistory';
import Error from './components/Error';
import Spinner from './components/Spinner';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, useMutation } from 'react-apollo';

import { AUTO_UPDATE } from './queries';

const devUri = 'http://localhost:5555/graphql';
const prodUri = 'https://pocket-money-app-je.herokuapp.com/graphql';

const client = new ApolloClient({
  uri: process.env.REACT_APP_NODE_ENV === 'production' ? prodUri : devUri,

  fetchOptions: {
    credentials: 'include',
  },

  request: operation => {
    const token = localStorage.getItem('token');

    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },

  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network Error', JSON.stringify(networkError, null, 2));
      localStorage.setItem('token', '');
    }
  },
});

const Root = ({ refetch, session }) => {
  const [autoUpdate, { loading, error }] = useMutation(AUTO_UPDATE);

  useEffect(() => {
    autoUpdate();
    console.log('Check Auto Update');
  }, [autoUpdate]);

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <Router>
      <header className="mb-auto">
        <Navbar session={session} />
      </header>
      <main className="px-3">
        <Switch>
          <Route exact path="/" render={() => <App session={session} />} />
          <Route path="/signin" render={() => <SignIn refetch={refetch} />} />
          <Route
            path="/register"
            render={() => <Register refetch={refetch} />}
          />
          <Route
            path="/profile"
            render={() => <Profile session={session} refetch={refetch} />}
          />
          <Route
            path="/history"
            render={() => <BankHistory session={session} />}
          />
          <Redirect to="/" />
        </Switch>
      </main>
      <footer className="mt-auto text-white-50"></footer>
    </Router>
  );
};

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(reg => console.log('Service Worker: Registered'))
      .catch(error => console.log('Service Worker: Error:', error));
  });
}
