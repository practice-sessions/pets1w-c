import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
//import { Link } from 'react-router-dom'; 
//import AuthContext from '../../context/auth/authContext';

const Navbar = ({ icon, title }) => {
  // const authContext = useContext(AuthContext);

  // const { isAuthenticated, logout, user } = authContext;

  // const onLogout = () => {
  //   logout();
  // }
  // const authLinks = (
  //   <Fragment>
  //     <li>Welcome { user && user.firstname }</li> 
  //     <li>
  //       <a onClick={onLogout} href="#!">
  //         <i className="fas fa-sign-out-alt" />{' '}
  //         <span className="hide-sm">Logout</span>
  //       </a>
  //     </li>
  //   </Fragment>
  // ); 

  // const guestLinks = (
  //   <Fragment>
  //     <li>
  //       <Link to='/register' className="w3-bar-item w3-button">Add new client</Link>
  //     </li>
  //     <li>
  //       <Link to='/get-client' className="w3-bar-item w3-button">Get client</Link>
  //     </li>
  //   </Fragment>
  // );

  return (
    <Fragment>
        <nav className="navbar-left bg-primary">
          <h2>
            <i className={icon} />
            {title}
          </h2>
          {/* <ul>
            {isAuthenticated ? authLinks : guestLinks}
          </ul> */}
        </nav>
    </Fragment>
  ); 
}

Navbar.defaultProps = {
  title: "Pets client-side",
  icon: "fas fa-dog fa-fw"
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default Navbar;
