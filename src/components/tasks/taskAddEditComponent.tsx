import React, { useState, useEffect } from 'react';
import { TaskModel } from '../../models/taskModel';
import MainService from '../../services/mainService';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import * as HelperFunctions from '../../common/functions/helperFunctions';
import { TaskStatus } from '../../common/enums';
import AuthService from '../../services/authService';

const mainService = new MainService();
const authService = new AuthService();

const TasksComponent = (props) => {
    const [task, setTask] = useState(new TaskModel());
    let title = props.taskId > 0 ? "Update task" : "Create task";
    let taskStatuses = HelperFunctions.enumToDropdownArray(TaskStatus);

    const saveDialog = () => {
        if (props.taskId === 0)
            createTask(task);
        else
            updateTask(task);
    }

    const handleChange = (value, prop) => {
        const ntask = { ...task };
        ntask[prop] = value;
        setTask(ntask);
    }

    const createTask = (task) => {
        let userId = authService.getUserId();
        const uTask = { ...task };
        uTask.userId = userId;
        mainService.createTask(uTask).then(
            res => {
                props.setOpen(false);
                props.getTasks();
            },
            error => {
                console.log('Delete task error')
            }
        );
    }

    const updateTask = (task) => {
        if (!task.isAdmin) {
            const updatedtask = { ...task };
            mainService.updateTask(updatedtask).then(
                res => {
                    props.setOpen(false);
                    props.getTasks();
                },
                error => {
                    console.log('Delete task error')
                }
            );
        }
    }

    useEffect(() => {
        const gettask = () => {
            mainService.getTask(props.taskId).then(
                res => {
                    setTask(res.task);
                },
                error => {
                    console.log("Error getting tasks")
                }
            );
        }

        if (props.taskId > 0)
            gettask();
        else
            setTask(new TaskModel())

    }, [props.taskId]);

    return (
        <Dialog open={props.open} onClose={() => props.setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <TextField
                    id="title"
                    label="Title"
                    type="text"
                    value={task.title || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'title')}
                />
                <TextField
                    id="estimation"
                    label="Estimation"
                    type="number"
                    value={task.estimation || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'estimation')}
                />
                <FormControl style={{ width: '100%', marginBottom: 10 }}>
                    <InputLabel htmlFor="task-status-label">Task status</InputLabel>
                    <Select
                        name="taskStatus"
                        value={task.taskStatus || ''}
                        onChange={(e) => handleChange(e.target.value, 'taskStatus')}
                        style={{ marginRight: 10 }}
                        inputProps={{
                            id: 'task-status-label'
                        }}
                    >
                        {
                            taskStatuses.map(m => <MenuItem key={m.value} value={m.value}> {m.value ? m.label : <em>{m.label}</em>}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <TextField
                    id="desc"
                    label="Description"
                    type="text"
                    value={task.desc || ''}
                    fullWidth
                    style={{ marginBottom: 10 }}
                    onChange={(e) => handleChange(e.target.value, 'desc')}
                    multiline
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={saveDialog} color="primary" disabled={!task || task.title?.trim() === '' ||
                    task.desc?.trim() === '' || task.estimation === 0 || task.taskStatus === 0 || !task.taskStatus || !task.estimation}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TasksComponent;
