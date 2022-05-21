
import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import LogoBottom from './icons/logoBottom';
import LogoTop from './icons/LogoTop';
import GitHubLogo from '../static/images/github-grey.png'
import Linkdin from '../static/images/linkedin-grey-2.jpg'
import { useSelector } from "react-redux";
import "./NavBar.css";

const NavBar = () => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      {sessionUser && (
        <>
          <div className='navbar_logo_container flex-row'>
            <NavLink to='/' exact={true} className='logo_main flex-column navlinks' activeClassName='active'>
              <LogoTop />
              <LogoBottom />
            </NavLink>
          </div>
          <div className='navbar_search_container'>
            <input
              className="navbar_search"
              placeholder="Search"
            />
          </div>
          <div className='navbar_links_container flex-row'>

            <LogoutButton />
            <a className="about_links flex-column" href='https://github.com/stevenkleinberg' target="_blank">
              <img className='icon_img' src={GitHubLogo}></img>
            </a>
            <a className="about_links flex-column" href='https://www.linkedin.com/in/steven-kleinberg-ab7627212/' target="_blank">
              <img className='icon_img' src={Linkdin}></img>
            </a>
          </div>
        </>
      )}
      {!sessionUser && (
        <div className='navbar_links_container flex-row'>
          <NavLink to='/login' exact={true} className="navlinks" activeClassName='active'>
            Login
          </NavLink>
          <NavLink to='/sign-up' exact={true} className="navlinks" activeClassName='active'>
            Sign Up
          </NavLink>
          <a className="about_links flex-column" href='https://github.com/stevenkleinberg' target="_blank">
            <img className='icon_img' src={GitHubLogo}></img>
          </a>
          <a className="about_links flex-column" href='https://www.linkedin.com/in/steven-kleinberg-ab7627212/' target="_blank">
            <img className='icon_img' src={Linkdin}></img>
          </a>
        </div>
      )}

    </nav>
  );
}

export default NavBar;
