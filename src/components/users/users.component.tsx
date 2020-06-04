import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { UserModel } from '../../models/userModel';
import MainService from '../../services/mainService';
import { Delete, Check, Close, VerifiedUser, Edit } from '@material-ui/icons';
import UserAddEditComponent from './usersAddEdit.component';
import { StyledTableCell, StyledTableRow } from '../../common/functions/helperFunctions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const mainService = new MainService();

const UsersComponent = () => {
    const classes = useStyles();
    const [users, setUsers] = useState(new Array<UserModel>());
    const [open, setOpen] = useState(false);
    const [selectedUserId, setUserId] = useState(0);

    const onDeleteClick = (e, user) => {
        e.preventDefault();
        mainService.deleteUser(user.id).then(
            res => {
                getUsers();
            },
            error => {
                console.log('Delete user error')
            }
        );
    }

    const makeAdmin = (e, user) => {
        e.preventDefault();
        if (!user.isAdmin) {
            const updatedUser = { ...user };
            updatedUser.isAdmin = true;
            mainService.updateUser(updatedUser).then(
                res => {
                    getUsers();
                },
                error => {
                    console.log('Delete user error')
                }
            );
        }
    }

    const getUsers = () => {
        mainService.getUsers().then(
            res => {
                setUsers(res.users);
            },
            error => {
                console.log("Error getting users")
            }
        );
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="app-content">
            <h1 style={{ color: 'white' }}>Users</h1>
            <Button onClick={() => {
                setUserId(0);
                setOpen(true);
            }}
                variant="contained" color="secondary" style={{ marginBottom: 10 }}>
                Add
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Username</StyledTableCell>
                            <StyledTableCell>First name</StyledTableCell>
                            <StyledTableCell>Last name</StyledTableCell>
                            <StyledTableCell>Admin</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users.length > 0 ? users.map((user: UserModel) => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell>{user.username}</StyledTableCell>
                                <StyledTableCell>{user.firtsName}</StyledTableCell>
                                <StyledTableCell>{user.lastName}</StyledTableCell>
                                <StyledTableCell>{user.isAdmin ? <Check style={{ color: 'green' }} /> :
                                    <Close style={{ color: '#e63b3b' }} />}</StyledTableCell>
                                <StyledTableCell>
                                    {!user.isAdmin ?
                                        <>
                                            <a href="/" onClick={e => onDeleteClick(e, user)} style={{ marginRight: 10 }}>
                                                <Delete style={{ color: '#e63b3b' }} />
                                            </a>
                                            <a href="/" onClick={e => makeAdmin(e, user)} style={{ marginRight: 10 }}>
                                                <VerifiedUser style={{ color: 'green' }} />
                                            </a>
                                            <a href="/" onClick={e => {
                                                e.preventDefault();
                                                setUserId(user.id);
                                                setOpen(true);
                                            }} style={{ marginRight: 5 }}>
                                                <Edit />
                                            </a>
                                        </>
                                        : null}
                                </StyledTableCell>
                            </StyledTableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {open ?
                <UserAddEditComponent open={open} setOpen={setOpen} userId={selectedUserId} getUsers={getUsers} /> : null}
        </div>
    );
}

export default UsersComponent;
