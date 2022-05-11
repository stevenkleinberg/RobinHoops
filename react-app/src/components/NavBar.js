
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import Logo from './icons/logo';
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">

        <div className='navbar_logo_container'>
          <NavLink to='/' exact={true} className='logo navlinks' activeClassName='active'>
            <Logo />
          </NavLink>
        </div>
        <div className='navbar_search_container'>
          <div>
            <input
              className="navbar_search"
              placeholder="Search"
            />
          </div>
        </div>
        <div className='navbar_links_container'>
          <NavLink to='/' exact={true} className="navlinks" activeClassName='active'>
            Home
          </NavLink>
          <NavLink to='/login' exact={true}  className="navlinks" activeClassName='active'>
            Login
          </NavLink>
          <NavLink to='/sign-up' exact={true}  className="navlinks" activeClassName='active'>
            Sign Up
          </NavLink>
          <NavLink to='/users' exact={true}  className="navlinks" activeClassName='active'>
            Users
          </NavLink>
          <LogoutButton />
        </div>

    </nav>
  );
}

export default NavBar;
