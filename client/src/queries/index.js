import { gql } from 'apollo-boost';

// User Queries

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
    }
  }
`;

// User Mutations

export const SIGN_IN_USER = gql`
  mutation($username: String!, $password: String!) {
    signInUser(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation($username: String!, $password: String!) {
    registerUser(username: $username, password: $password) {
      token
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation($username: String!, $oldPassword: String!, $newPassword: String!) {
    changePassword(
      username: $username
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      token
    }
  }
`;

// Bank Queries

export const GET_BALANCE = gql`
  query {
    getBalance
  }
`;

export const GET_HISTORY = gql`
  query {
    getHistory {
      newBalance
      increment
      username
      date
    }
  }
`;

// Bank Mutations

export const AUTO_UPDATE = gql`
  mutation {
    autoUpdate
  }
`;

export const SET_BALANCE = gql`
  mutation($username: String!, $newValue: Float!) {
    setBalance(username: $username, newValue: $newValue)
  }
`;

export const UPDATE_BALANCE = gql`
  mutation($username: String!, $increment: Float!) {
    updateBalance(username: $username, increment: $increment)
  }
`;
