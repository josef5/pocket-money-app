import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import Error from '../Error';
import withAuth from '../withAuth.js';
import { CHANGE_PASSWORD } from '../../queries';

const initialState = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

const ChangePassword = ({ session, refetch }) => {
  const [state, setState] = useState({ ...initialState });
  const [actionCompleted, setActionCompleted] = useState(false);

  const username = session.getCurrentUser.username;
  const { oldPassword, newPassword, newPasswordConfirmation } = state;

  const clearState = () => {
    setState({ ...initialState });
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event, changePassword) => {
    event.preventDefault();

    changePassword()
      .then(async ({ data }) => {
        localStorage.setItem('token', data.changePassword.token);

        await refetch();

        clearState();

        setActionCompleted(true);
      })
      .catch(error => console.log('Error', error.message));
  };

  const validateForm = () => {
    const { oldPassword, newPassword, newPasswordConfirmation } = state;
    const isInvalid =
      !oldPassword ||
      !newPassword ||
      oldPassword === newPassword ||
      newPassword !== newPasswordConfirmation;
    return isInvalid;
  };
  return (
    <div>
      {actionCompleted ? (
        <>
          <h4>Password Changed</h4>
          {/* <h3>Success</h3> */}
          <button
            type="submit"
            className="w-100 btn btn-lg btn-primary mt-4"
            onClick={() => {
              setActionCompleted(false);
            }}
          >
            Change Again
          </button>
        </>
      ) : (
        <>
          <h4>Change Password</h4>
          <Mutation
            mutation={CHANGE_PASSWORD}
            variables={{ username, oldPassword, newPassword }}
          >
            {(changePassword, { data, loading, error }) => {
              return (
                <form
                  className="form"
                  onSubmit={event => handleSubmit(event, changePassword)}
                >
                  <input
                    type="password"
                    name="oldPassword"
                    className="form-control top-input"
                    placeholder="Old Password"
                    autoFocus
                    value={oldPassword}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control middle-input"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="newPasswordConfirmation"
                    className="form-control bottom-input"
                    placeholder="Confirm New Password"
                    value={newPasswordConfirmation}
                    onChange={handleChange}
                  />
                  <button
                    type="submit"
                    className="w-100 btn btn-lg btn-primary mt-4"
                    disabled={loading || validateForm()}
                  >
                    Submit
                  </button>
                  {error && <Error error={error} />}
                </form>
              );
            }}
          </Mutation>
        </>
      )}
    </div>
  );
};

export default withAuth(session => session && session.getCurrentUser)(
  ChangePassword
);
