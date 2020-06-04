import React, { useState, useEffect } from 'react';
import { UserModel } from '../../models/userModel';
import MainService from '../../services/mainService';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AuthService from '../../services/authService';

const mainService = new MainService();
const authService = new AuthService();

const UsersComponent = (props) => {
    const [user, setUser] = useState(new UserModel());
    let title = props.userId > 0 ? "Update user" : "Create user";

    const saveDialog = () => {
        if (props.userId === 0)
            createUser(user);
        else
            updateUser(user);
    }

    const handleChange = (value, prop) => {
        const nuser = { ...user };
        nuser[prop] = value;
        setUser(nuser);
    }

    const createUser = (user) => {
        authService.createUser(user).then(
            res => {
                props.setOpen(false);
                props.getUsers();
            },
            error => {
                console.log('Delete user error')
            }
        );
    }

    const updateUser = (user) => {
        if (!user.isAdmin) {
            const updatedUser = { ...user };
            mainService.updateUser(updatedUser).then(
                res => {
                    props.setOpen(false);
                    props.getUsers();
                },
                error => {
                    console.log('Delete user error')
                }
            );
        }
    }

    useEffect(() => {
        const getUser = () => {
            mainService.getUser(props.userId).then(
                res => {
                    setUser(res.user);
                },
                error => {
                    console.log("Error getting users")
                }
            );
        }

        if (props.userId > 0)
            getUser();
        else
            setUser(new UserModel())

    }, [props.userId]);

    return (
        <Dialog open={props.open} onClose={() => props.setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <TextField
                    id="userName"
                    label="Username"
                    type="text"
                    value={user.username || ''}
                    disabled={props.userId > 0}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'username')}
                />
                <TextField
                    id="firstname"
                    label="First name"
                    type="text"
                    value={user.firtsName || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'firtsName')}
                />
                <TextField
                    id="lastname"
                    label="Last name"
                    type="text"
                    value={user.lastName || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'lastName')}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={user.password || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'password')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={saveDialog} color="primary" disabled={!user || user.firtsName?.trim() === '' ||
                    user.lastName?.trim() === '' || user.username?.trim() === '' || user.password?.trim() === ''}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UsersComponent;
