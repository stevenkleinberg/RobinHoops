import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import Homepage from './components/homepage';
import {GetAllTeams} from "./store/team"
import { GetAllPlayers } from "./store/player"
import TeamPage from './components/TeamPage';
import PlayerPage from './components/PlayerPage';
function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
        await dispatch(GetAllTeams());
        await dispatch(GetAllPlayers())
    })();
    }, [dispatch]);

    if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/' exact={true} >
          <Homepage />
        </ProtectedRoute>
        <ProtectedRoute path='/teams/:id' >
          <TeamPage />
        </ProtectedRoute>
        <ProtectedRoute path='/players/:id' >
          <PlayerPage />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
