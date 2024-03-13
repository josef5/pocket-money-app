import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import Error from '../Error';
import { SIGN_IN_USER } from '../../queries';

const initialState = {
  username: '',
  password: '',
  rememberMe: false,
};

class SignIn extends React.Component {
  state = { ...initialState };

  componentDidMount() {
    // localStorage stores values as strings
    const rememberMe =
      localStorage.rememberMe && JSON.parse(localStorage.rememberMe);

    if (rememberMe) {
      this.setState({
        username: localStorage.username,
        password: localStorage.password,
        rememberMe,
      });
    }
  }

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleRememberMeChange = event => {
    const { name, checked } = event.target;
    console.log('checked type', typeof checked);
    this.setState({ [name]: checked });
  };

  handleSubmit = (event, signInUser) => {
    event.preventDefault();

    signInUser()
      .then(async ({ data }) => {
        //console.log('Sign in user:', data.signInUser);

        localStorage.setItem('token', data.signInUser.token);

        if (this.state.rememberMe) {
          localStorage.setItem('rememberMe', this.state.rememberMe);
          localStorage.setItem('username', this.state.username);
          localStorage.setItem('password', this.state.password);
        }

        await this.props.refetch();

        this.clearState();

        this.props.history.push('/');
      })
      .catch(error => console.log('Error', error.message));
  };

  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  };

  render() {
    const { username, password, rememberMe } = this.state;

    return (
      <div className="App form-signin">
        <h2 className="App">Sign in</h2>
        <Mutation mutation={SIGN_IN_USER} variables={{ username, password }}>
          {(signInUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, signInUser)}
              >
                <input
                  type="text"
                  name="username"
                  className="form-control top-input"
                  placeholder="Username"
                  autoComplete="on"
                  autoFocus
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  className="form-control bottom-input"
                  placeholder="Password"
                  autoComplete="on"
                  value={password}
                  onChange={this.handleChange}
                />
                <div className="checkbox my-2">
                  <label>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={rememberMe}
                      onChange={this.handleRememberMeChange}
                    />{' '}
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-100 btn btn-lg btn-primary mx-1"
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

export default withRouter(SignIn);
