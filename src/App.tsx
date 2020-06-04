import React from 'react';
import { connect } from "react-redux";
import './App.css';
import Content from './components/content/content'
import { BrowserRouter } from "react-router-dom";
import HeaderComponent from './components/header/headerComponent';
import AuthService from './services/authService';
import * as actionTypes from './store/actionTypes';

const authService = new AuthService();

const App = (props) => {
  if (authService.isAuthenticated() && !props.isUserLogged)
    props.onUserLogin();

  return (
    <BrowserRouter>

      <HeaderComponent isAuthenticated={authService.isAuthenticated()} logout={authService.logout} isAdmin={authService.isAdmin()} />

      <Content />

    </BrowserRouter>
  );
}

const mapsStateToProps = state => {
  return {
    isUserLogged: state.common.isUserLogged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUserLogin: () => dispatch({ type: actionTypes.USER_LOGIN })
  };
};


export default connect(mapsStateToProps, mapDispatchToProps)(App);
