import logoBottom from "../../static/images/hand.png"
import { NavLink } from 'react-router-dom';
const LogoBottom = () => {
    return (
        <>
        <img className="logo_bottom" src={logoBottom} alt="home" />
        <NavLink to='/' exact={true} className="navlinks home" activeClassName='active'>
            Home
          </NavLink>
        </>
    )
}

export default LogoBottom;
