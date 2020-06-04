import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TaskModel } from '../../models/taskModel';
import MainService from '../../services/mainService';
import { Delete, Edit } from '@material-ui/icons';
import TaskAddEditComponent from './taskAddEditComponent';
import Button from '@material-ui/core/Button';
import AuthService from '../../services/authService';
import { getEnumLabel, StyledTableCell, StyledTableRow } from '../../common/functions/helperFunctions';
import { TaskStatus } from '../../common/enums';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const mainService = new MainService();
const authService = new AuthService();

const TasksComponent = () => {
    const classes = useStyles();
    const [tasks, setTasks] = useState(new Array<TaskModel>());
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setTaskId] = useState(0);

    const onDeleteClick = (e, task) => {
        e.preventDefault();
        mainService.deleteTask(task.taskId).then(
            res => {
                getTasks();
            },
            error => {
                console.log('Delete task error')
            }
        );
    }

    const getAllTasks = () => {
        mainService.getAllTasks().then(
            res => {
                setTasks(res.tasks);
            },
            error => {
                console.log("Error getting tasks")
            }
        );
    }

    const getAllTasksForUser = (id) => {
        mainService.getAllTasksForUser(id).then(
            res => {
                setTasks(res.tasks);
            },
            error => {
                console.log("Error getting tasks")
            }
        );
    }

    const getTasks = () => {
        let isAdmin = authService.isAdmin();
        let id = authService.getUserId();
        if (isAdmin)
            getAllTasks();
        else
            getAllTasksForUser(id);
    }

    useEffect(() => {
        getTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app-content">
            <h1 style={{ color: 'white' }}>Tasks</h1>
            <Button onClick={() => {
                setTaskId(0);
                setOpen(true);
            }}
                variant="contained" color="secondary" style={{ marginBottom: 10 }}>
                Add
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {authService.isAdmin() ? <StyledTableCell>
                                For User
                            </StyledTableCell> : null}
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Estimation</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks && tasks.length > 0 ? tasks.map((task: TaskModel) => (
                            <StyledTableRow key={task.taskId}>
                                {authService.isAdmin() ? <StyledTableCell>
                                    {task.forUser}
                                </StyledTableCell> : null}
                                <StyledTableCell>{task.title}</StyledTableCell>
                                <StyledTableCell>{getEnumLabel(task.taskStatus, TaskStatus)}</StyledTableCell>
                                <StyledTableCell>{task.estimation} hours</StyledTableCell>
                                <StyledTableCell>
                                    <a href="/" onClick={e => onDeleteClick(e, task)} style={{ marginRight: 10 }}>
                                        <Delete style={{ color: '#e63b3b' }} />
                                    </a>
                                    <a href="/" onClick={e => {
                                        e.preventDefault();
                                        setTaskId(task.taskId);
                                        setOpen(true);
                                    }} style={{ marginRight: 5 }}>
                                        <Edit />
                                    </a>
                                </StyledTableCell>
                            </StyledTableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {open ?
                <TaskAddEditComponent open={open} setOpen={setOpen} taskId={selectedTaskId} getTasks={getTasks} /> : null}
        </div>
    );
}

export default TasksComponent;
