import React from 'react';
import { Query } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import Error from '../Error';
import withAuth from '../withAuth.js';
import Spinner from '../Spinner';
import { GET_HISTORY } from '../../queries';

const BankHistory = ({ session }) => {
  return (
    <div className="App bank-history">
      <h2>History</h2>
      <Query query={GET_HISTORY} fetchPolicy={'no-cache'}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <Error error={error} />;

          return (
            <div className="history-table">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Increment</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.getHistory.reverse().map((item, index) => (
                    <tr key={index}>
                      <td>{moment(item.date).format('DD-MM-YYYY HH:mm')}</td>
                      <td>{item.username}</td>
                      <td>{item.increment.toFixed(2)}</td>
                      <td>{item.newBalance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }}
      </Query>
      <NavLink to="/" className="link-secondary">
        Back
      </NavLink>
    </div>
  );
};

export default withAuth(session => session && session.getCurrentUser)(
  BankHistory
);
