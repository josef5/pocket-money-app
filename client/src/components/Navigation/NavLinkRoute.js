import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavLinkRoute = ({ route, label }) => {
  const location = useLocation();

  return (
    <NavLink
      to={route}
      exact={route === '/'}
      className={`nav-link${location.pathname === route ? ' disabled' : ''}`}
    >
      {label}
    </NavLink>
  );
};

export default NavLinkRoute;
