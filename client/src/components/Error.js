import React from 'react';

const Error = ({ error }) => (
  <div className="mt-2">
    <p>{error.message.replace('GraphQL error', 'Error')}</p>
  </div>
);

export default Error;
