import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import Error from '../Error';
import { REGISTER_USER } from '../../queries';

const initialState = {
  username: '',
  password: '',
  passwordConfirmation: '',
};

class Register extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, registerUser) => {
    event.preventDefault();

    registerUser()
      .then(async ({ data }) => {
        localStorage.setItem('token', data.registerUser.token);

        await this.props.refetch();

        this.clearState();

        this.props.history.push('/');
      })
      .catch(error => console.log('Error', error.message));
  };

  validateForm = () => {
    const { username, password, passwordConfirmation } = this.state;
    const isInvalid =
      !username || !password || password !== passwordConfirmation;
    return isInvalid;
  };

  render() {
    const { username, password, passwordConfirmation } = this.state;

    return (
      <div className="App">
        <h2>Register New Account</h2>
        <Mutation mutation={REGISTER_USER} variables={{ username, password }}>
          {(registerUser, { data, loading, error }) => {
            return (
              <form
                className="form form-register"
                onSubmit={event => this.handleSubmit(event, registerUser)}
              >
                <input
                  type="text"
                  name="username"
                  className="form-control top-input"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  className="form-control middle-input"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  className="form-control bottom-input"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  className="w-100 btn btn-lg btn-primary mt-4"
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Register);
