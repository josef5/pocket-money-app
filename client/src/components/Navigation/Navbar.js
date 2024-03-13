import React from 'react';
import SignOut from '../Auth/SignOut';
import NavLinkRoute from './NavLinkRoute';

const Navbar = ({ session }) => (
  <div>
    <nav className="nav nav-masthead justify-content-center float-md-end">
      {session && session.getCurrentUser ? (
        <NavbarAuth session={session} />
      ) : (
        <NavbarUnAuth />
      )}
    </nav>
  </div>
);

const NavbarAuth = ({ session }) => (
  <>
    <NavLinkRoute route="/" label="Balance" />
    <NavLinkRoute route="/profile" label={session.getCurrentUser.username} />
    <SignOut />
  </>
);

const NavbarUnAuth = () => (
  <>
    <NavLinkRoute route="/" label="Balance" />
    <NavLinkRoute route="/signin" label="Sign In" />
  </>
);

export default Navbar;
