import * as React from "react";
import Spinner from '../../common/components/spinner/spinner';
import { UserModel } from '../../models/userModel';
import Button from '@material-ui/core/Button';
import Growl from '../../common/components/growl/growl';
import { NavLink } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import GrowlContent from '../../common/components/growl/growlContent';
import AuthService from '../../services/authService';

interface IProps {
    history: any,
    location: any
}

interface IState {
    isLoading: boolean;
    user: UserModel;
    mode: string;
    passError: boolean;
    confPassError: boolean;
    emailError: boolean;
}

class CreateNewAccountComponent extends React.Component<IProps, IState> {

    authService = new AuthService();
    growl: any;

    // min 8 characters, 1 alpha lowercase, 1 alpha uppercase, 1 number and 1 special
    //eslint-disable-next-line
    passwordStrongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    // min 6 characters, 1 alpha and 1 number
    passwordMediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    constructor(props: IProps) {
        super(props);

        this.state = {
            isLoading: false,
            user: new UserModel(),
            mode: 'createNewAccount',
            passError: false,
            confPassError: false,
            emailError: false
        };
    }

    handleChange = (key, value) => {
        const user: UserModel = { ...this.state.user };
        user[key] = value;
        this.setState({ user: { ...user } });

        if (key === 'password') {
            this.setState({ passError: !this.passwordMediumRegex.test(value) });
        }

        if (key === 'confirmPassword') {
            this.setState({ confPassError: user.password !== user.confirmPassword });
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleCreateButton(e);
        }
    }

    isValidAddEditForm() {
        let message = '';

        const { user } = this.state;

        if (!user.username || user.username.trim() === '') {
            message += 'Please enter Username. ';
        }

        if (!user.firtsName || user.firtsName.trim() === '') {
            message += 'Please enter First name. ';
        }

        if (!user.lastName || user.lastName.trim() === '') {
            message += 'Please enter Last name. ';
        }

        if (!user.password || user.password.trim() === '') {
            message += 'Please enter Password. ';
        }

        if (!user.confirmPassword || user.confirmPassword.trim() === '') {
            message += 'Please enter Confirm Password. ';
        }

        if (user.password && user.password.trim() !== '' &&
            user.confirmPassword && user.confirmPassword.trim() !== '' &&
            user.password !== user.confirmPassword) {
            message += 'Password and Confirm Password are different. ';
        }

        if (user.password && !this.passwordMediumRegex.test(user.password)) {
            message += 'Password must be at least 6 characters and contain at least 1 alphabetical and 1 numeric character. ';
        }

        if (message !== '') {
            this.growl.show({ severity: 'error', summary: message });
        }

        return message === '';
    }

    handleCreateButton = event => {
        event.preventDefault();

        if (!this.isValidAddEditForm()) return;

        this.setState({
            isLoading: true
        });

        const user = this.state.user;

        this.authService.createUser(user).then(
            (result: any) => {
                this.setState({
                    isLoading: false,
                    mode: 'successRegistration'
                });
            })
            .catch(error => {
                this.growl.show({ severity: 'error', summary: error.message });
                this.setState({
                    isLoading: false
                });
            });
    }


    public render() {
        const { isLoading, user, mode, passError, confPassError } = this.state;

        const registrationFormHtml =
            <>
                <div className="p-g p-fluid">
                    <div className="p-g-12 p-md-12" style={{ marginBottom: 10 }}>
                        <TextField
                            style={{ width: 300 }}
                            autoComplete="off"
                            required
                            name="firstName"
                            label={'First Name'}
                            type="text"
                            value={user && user.firtsName ? user.firtsName : ""}
                            onChange={(e) => this.handleChange('firtsName', e.target['value'])}
                            helperText={"Please enter first name."}
                        />
                    </div>
                    <div className="p-g-12 p-md-12" style={{ marginBottom: 10 }}>
                        <TextField
                            style={{ width: 300 }}
                            autoComplete="off"
                            required
                            name="lastname"
                            label={'Last Name'}
                            type="text"
                            value={user && user.lastName ? user.lastName : ""}
                            onChange={(e) => this.handleChange('lastName', e.target['value'])}
                            helperText={"Please enter last name."}
                        />
                    </div>
                    <div className="p-g-12 p-md-12" style={{ marginBottom: 10 }}>
                        <TextField
                            style={{ width: 300 }}
                            autoComplete="off"
                            required
                            name="username"
                            label={'Username'}
                            type="text"
                            value={user && user.username ? user.username : ""}
                            onChange={(e) => this.handleChange('username', e.target['value'])}
                            helperText={"Please enter personal username."}
                        />
                    </div>
                    <div className="p-g-12 p-md-12" style={{ marginBottom: 10 }}>
                        <TextField
                            style={{ width: 300 }}
                            autoComplete="off"
                            required
                            error={passError}
                            type="password"
                            name="password"
                            label={'Password'}
                            onKeyPress={this.handleKeyPress}
                            onChange={(e) => this.handleChange('password', e.target['value'])}
                            value={user && user.password ? user.password : ""}
                            helperText={"6 characters or more, at least 1 alphabetical and 1 numeric."}
                        />
                    </div>
                    <div className="p-g-12 p-md-12" style={{ marginBottom: 10 }}>
                        <TextField
                            style={{ width: 300 }}
                            autoComplete="off"
                            required
                            error={confPassError}
                            type="password"
                            name="confirmPassword"
                            label={'Confirm Password'}
                            onKeyPress={this.handleKeyPress}
                            onChange={(e) => this.handleChange('confirmPassword', e.target['value'])}
                            value={user && user.confirmPassword ? user.confirmPassword : ""}
                            helperText={"Please enter password again."}
                        />
                    </div>
                </div>
                <div style={{ padding: '10px 9px' }}>
                    <Button variant="contained" size="medium" color='primary' onClick={this.handleCreateButton}
                        style={{ marginBottom: '15px' }}>
                        Create
          </Button>
                </div>
            </>

        const successRegistrationHtml =
            <>
                <div>
                    <GrowlContent variant="success" message={'You have successfully created a new account.'} />
                </div>
                <div style={{ marginTop: '20px' }}>
                    {'Now you can go to '} <NavLink exact to="/login">login</NavLink>
                </div>
            </>


        let resultHtml;

        switch (mode) {
            case 'successRegistration':
                resultHtml = successRegistrationHtml;
                break;
            default:
                resultHtml = registrationFormHtml;
        }

        return (
            <div className="flex-center">
                <div className="login-container">
                    {isLoading ? <Spinner /> : null}
                    <Growl ref={(el) => this.growl = el} />

                    <h1>{'Create a New Account'}</h1>

                    <div>
                        {resultHtml}
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateNewAccountComponent;