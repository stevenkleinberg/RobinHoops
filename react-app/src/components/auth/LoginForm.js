import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { login } from '../../store/session';
import Splash from './splash';
import "./auth.css"
const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("demo@aa.io", "password"));
    if (data) {
      setErrors(data);
      return;
    }
    return <Redirect to='/' />
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='auth_container flex-row'>
      <div className='auth_container_left flex-column'>
        <Splash />
      </div>
      <div className='auth_container_right_login flex-column'>
        <div className='auth_box_body flex-column'>
          <div className='auth_box_header flex-row'>
            Log In
          </div>
          <div className='auth_box_main flex-column'>
            <form className='auth_box_form' onSubmit={onLogin}>
              <div className='auth_box_row flex-column'>
                {errors.map((error, ind) => (
                  <div className='auth_box_error flex-row' key={ind}>{error}</div>
                ))}
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>Email</label>
                <input
                  className='auth_box_input'
                  name='email'
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={updateEmail}
                />
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>Password </label>
                <input
                  className='auth_box_input'
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={updatePassword}
                />
              </div>
              <button className='auth_box_button' type='submit'>Login</button>
              <button className='auth_box_button' onClick={demoLogin} >Login as Demo User</button>
            </form>
            <div className="auth_box_bottom flex-row">
              <NavLink className="auth_box_navlink" to='/sign-up'>
                Dont have an account?
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
