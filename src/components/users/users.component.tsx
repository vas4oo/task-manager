import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { UserModel } from '../../models/userModel';
import MainService from '../../services/mainService';
import { Delete, Check, Close } from '@material-ui/icons';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: 'black',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const mainService = new MainService();

const onDeleteClick = (e, user) => {
    e.preventDefault();
    mainService.deleteUser(user.id).then(
        res => {
            console.log(res);
        },
        error => {
            console.log('Delete user error')
        }
    );
}

const UsersComponent = () => {
    const classes = useStyles();
    const [users, setUsers] = useState(new Array<UserModel>());

    useEffect(() => {
        const getUsers = () => {
            mainService.getUsers().then(
                res => {
                    console.log(res)
                    setUsers(res.users);
                },
                error => {
                    console.log("Error getting users")
                }
            );
        }
        getUsers();
    }, []);

    return (
        <div className="app-content">
            <h1>Users</h1>
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
                                        <a href="/" onClick={e => onDeleteClick(e, user)}>
                                            <Delete style={{ color: '#e63b3b' }} />
                                        </a> : null}
                                </StyledTableCell>
                            </StyledTableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default UsersComponent;
