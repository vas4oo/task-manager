import * as React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import * as actionTypes from "../../store/actionTypes";

interface IProps {
  history: any;
  onUserLogout: any;
  isUserLogged: boolean;
}

interface IState {
  isAuthenticated: boolean;
  isLoginDialogOpen: boolean;
}

const HeaderComponent = (props) => {
  const logout = () => {
    props.onUserLogout();
    props.history.push("/login");
    props.logout();
  }

  React.useEffect(() => {
    console.log(props.isUserLogged)
  }, [props.isUserLogged])

  return (
    <div className="app-header">
      <div style={{ display: 'flex' }}>
        <div style={{ fontSize: 18 }}>
          Task Manager
        </div>
        <div style={{ display: 'flex', paddingLeft: 20 }}>
          {props.isAuthenticated ?
            <div className="nav-links">
              <NavLink exact to="/" activeClassName="active-link">
                <div className="app-navigation-item">
                  Home
                    </div>
              </NavLink>

              <NavLink exact to="/tasks" activeClassName="active-link">
                <div className="app-navigation-item">
                  Task
                    </div>
              </NavLink>
              {props.isAdmin ?
                <NavLink exact to="/users" activeClassName="active-link">
                  <div className="app-navigation-item">
                    Users
                    </div>
                </NavLink> : null}
            </div> : null}
        </div>

      </div>
      {props.isAuthenticated ?
        <div
          className="app-header-item user-menu-web"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </div> : null}
    </div>
  );

}

const mapsStateToProps = state => {
  return {
    isUserLogged: state.common.isUserLogged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUserLogout: () => dispatch({ type: actionTypes.USER_LOGOUT })
  };
};

export default withRouter(connect(mapsStateToProps, mapDispatchToProps)(HeaderComponent));
