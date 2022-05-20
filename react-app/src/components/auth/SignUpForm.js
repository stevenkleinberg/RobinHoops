import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom';
import { signUp } from '../../store/session';
import Splash from './splash';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data)
      }
    }
    else{
      setErrors(["Password: Passwords must match"])
      setRepeatPassword("")
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className='auth_container flex-row'>
      <div className='auth_container_left flex-column'>
        <Splash />
      </div>
      <div className='auth_container_right_signup flex-column'>
        <div className='auth_box_body flex-column'>
          <div className='auth_box_header flex-row'>
            Sign Up
          </div>
          <div className='auth_box_main flex-column'>
            <form className='auth_box_form' onSubmit={onSignUp}>
              <div className='auth_box_row flex-column'>
                {errors.map((error, ind) => (
                  <div className='auth_box_error flex-row' key={ind}>{error}</div>
                ))}
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>User Name</label>
                <input
                  className='auth_box_input'
                  type='text'
                  name='username'
                  onChange={updateUsername}
                  value={username}
                ></input>
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>Email</label>
                <input
                  className='auth_box_input'
                  type='text'
                  name='email'
                  onChange={updateEmail}
                  value={email}
                ></input>
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>Password</label>
                <input
                  className='auth_box_input'
                  type='password'
                  name='password'
                  onChange={updatePassword}
                  value={password}
                ></input>
              </div>
              <div className='auth_box_row flex-row'>
                <label className='auth_box_label'>Repeat Password</label>
                <input
                  className='auth_box_input'
                  type='password'
                  name='repeat_password'
                  onChange={updateRepeatPassword}
                  value={repeatPassword}
                  required={true}
                ></input>
              </div>
              <button className='auth_box_button' type='submit'>Sign Up</button>
            </form>
            <div className="auth_box_bottom flex-row">
              <NavLink className="auth_box_navlink" to='/login'>
               Already have an account?
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
