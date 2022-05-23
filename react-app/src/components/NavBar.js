import React, { useEffect, useState } from "react";
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
  const rawPlayers = useSelector((state)=> state.players)
  const rawTeams = useSelector((state)=> state.teams)
  const teamsNoAll = {... rawTeams};
  delete teamsNoAll["all"];
  const playersNoAll = {...rawPlayers}
  delete playersNoAll["all"]
  const teams = Object.values(teamsNoAll)
  const players = Object.values(playersNoAll)
  const teamsAndPlayers = teams.concat(players)
  console.log(teamsAndPlayers)
  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (searchInput.length) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchInput]);

  useEffect(() => {
    if (!showResults) return;

    const closeResults = () => {
      setShowResults(false);
      setSearchInput("")
    };

    document.addEventListener("click", closeResults);

    return () => document.removeEventListener("click", closeResults);
  }, [showResults]);

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
          />
          {showResults && (
            <div className="search_results">
              <ul>
                {teamsAndPlayers
                  ?.filter((stock) => {
                    const stockName = stock.name;
                    const match = stockName.toLowerCase().startsWith(searchInput.toLowerCase())
                    return match;
                  }).length ?
                  teamsAndPlayers
                  ?.filter((stock) => {
                    const stockName = stock.name;
                    const match = stockName.toLowerCase().startsWith(searchInput.toLowerCase())
                    return match;
                  }).map((stock) => (
                    <li key={stock.id} className="flex-row search_results_li">
                      <a
                        href={playersNoAll[stock.id] && playersNoAll[stock.id].name == stock.name? `/players/${stock.id}` : `/teams/${stock.id}`}
                        className="search_results_a"
                      >
                        {stock.name}
                      </a>
                    </li>
                  )
                  ) : teamsAndPlayers
                  ?.filter((stock) => {
                    const stockName = stock.name;
                    const match = stockName.toLowerCase().includes(searchInput.toLowerCase())
                    return match;
                  })
                  .map((stock) => (
                    <li key={stock.id} className="flex-row search_results_li">
                      <a
                        href={playersNoAll[stock.id] && playersNoAll[stock.id].name == stock.name? `/players/${stock.id}` : `/teams/${stock.id}`}
                        className="search_results_a"
                      >
                        {stock.name}
                      </a>
                    </li>
                  )
                  )}
              </ul>
            </div>
          )}
          </div>
          <div className='navbar_links_container flex-row'>

            <LogoutButton />
            <a className="about_links flex-column" href='https://github.com/stevenkleinberg/RobinHoops' target="_blank">
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
          <a className="about_links flex-column" href='https://github.com/stevenkleinberg/RobinHoops' target="_blank">
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
