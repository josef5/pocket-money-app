import React from 'react';
import withAuth from '../withAuth.js';
import ChangePassword from './ChangePassword';

const Profile = ({ session, refetch }) => (
  <div className="App">
    <h1 className="mb-4">{session.getCurrentUser.username}</h1>
    <ChangePassword session={session} refetch={refetch} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
