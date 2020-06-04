import * as React from "react";
import Spinner from "../../common/components/spinner/spinner";
import { UserModel } from "../../models/userModel";
import { withRouter } from "react-router-dom";
import AuthService from "../../services/authService";
import Growl from "../../common/components/growl/growl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actionTypes";

interface IProps {
  history: any;
  isUserLogged?: boolean;
  userLogin?: any;
  dialogOpen: boolean;
  closeDialog: any;
  handleRegister: any;
}

interface IState {
  isLoading: boolean;
  user: UserModel;
  isLogged: boolean;
}

class LoginComponent extends React.Component<IProps, IState> {
  authService = new AuthService();
  growl: any;

  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoading: false,
      user: new UserModel(),
      isLogged: false
    };
  }

  componentDidMount() { }

  handleChange = (key, value) => {
    const user: UserModel = { ...this.state.user };
    user[key] = value;
    this.setState({ user: { ...user } });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleLoginButton(e);
    }
  };

  isValidAddEditForm() {
    let message = "";

    if (!this.state.user.username || this.state.user.username.trim() === "") {
      message += "Please enter username.";
    }

    if (!this.state.user.password || this.state.user.password.trim() === "") {
      message += "Please enter Password.";
    }

    if (message !== "") {
      this.growl.show({ severity: "error", summary: message });
    }

    return message === "";
  }

  handleLoginButton = event => {
    event.preventDefault();

    if (!this.isValidAddEditForm()) return;

    this.setState({
      isLoading: true
    });

    const user = this.state.user;

    this.authService
      .login(user)
      .then((data: any) => {
        if (data) {
          this.setState(
            {
              isLoading: false,
              isLogged: data,
              user: new UserModel()
            },
            () => {
              this.props.userLogin();
            }
          );
        }
      })
      .catch(error => {
        this.growl.show({ severity: "error", summary: error.message });
        this.setState({
          isLoading: false
        });
      });
  };

  handleRegister = () => {
    this.props.history.push(`/register`);
  }

  public render() {
    const { isLoading, user } = this.state;

    return (
      <div className="flex-center">
        <div className="login-container">
          {isLoading ? <Spinner /> : null}
          <Growl ref={el => (this.growl = el)} />
          <div style={{ marginBottom: 10 }}>
            <TextField
              style={{ width: '100%' }}
              name="username"
              label="Username"
              type="username"
              value={user && user.username ? user.username : ""}
              onChange={e => this.handleChange("username", e.target["value"])}
            />
          </div>
          <div>
            <TextField
              style={{ width: '100%' }}
              type="password"
              name="password"
              label="Password"
              onKeyPress={this.handleKeyPress}
              onChange={e => this.handleChange("password", e.target["value"])}
              value={user && user.password ? user.password : ""}
            />
          </div>


          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
            <div>
              <Button color="primary" onClick={this.handleRegister}>
                Register
              </Button>
            </div>
            <div>
              <Button color="primary" onClick={this.handleLoginButton}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isUserLogged: state.isUserLogged
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLogin: () => dispatch({ type: actionTypes.USER_LOGIN })
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginComponent));
