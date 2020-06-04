import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import HomeComponent from "../home/homeComponent";
import UsersComponent from "../users/users.component";
import AuthService from "../../services/authService";
import RegisterComponent from '../login/registerComponent';
import LoginComponent from '../login/loginComponent';
import TasksComponent from "../tasks/tasks.component";

const NoMatch = () => (
  <div className="app-content">
    <h3>
      URL address <code>{window.location.pathname}</code> not match.
    </h3>
  </div>
);

interface IProps {
  isUserLogged: boolean;
}

interface IState { }

class Content extends React.Component<IProps, IState> {
  аuthService = new AuthService();

  public render() {
    return (
      <>
        <Switch>
          <Route exact path="/" component={this.аuthService.isAuthenticated() ? HomeComponent : LoginComponent} />
          <Route exact path="/index.html" component={this.аuthService.isAuthenticated() ? HomeComponent : LoginComponent} />
          <Route exact path="/users" component={this.аuthService.isAuthenticated() ? UsersComponent : LoginComponent} />
          <Route exact path="/tasks" component={this.аuthService.isAuthenticated() ? TasksComponent : LoginComponent} />
          <Route exact path="/register" component={this.аuthService.isAuthenticated() ? HomeComponent : RegisterComponent} />
          <Route exact path="/login" component={this.аuthService.isAuthenticated() ? HomeComponent : LoginComponent} />

          {/* <Route exact path="/user/dashboard"
            component={this.аuthService.isAuthenticated() ? UserDashboardComponent : NotAuthenticatedComponent} /> */}

          <Route component={NoMatch} />
        </Switch>
      </>
    );
  }
}

const mapsStateToProps = state => {
  return {
    isUserLogged: state.common.isUserLogged
  };
};

export default connect(mapsStateToProps, null)(Content);
