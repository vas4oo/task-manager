import React from 'react';
import { connect } from "react-redux";
import './App.css';
import Content from './components/content/content'
import { BrowserRouter } from "react-router-dom";
import HeaderComponent from './components/header/headerComponent';
import AuthService from './services/authService';

const authService = new AuthService();

const App = () => {

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


export default connect(mapsStateToProps)(App);
