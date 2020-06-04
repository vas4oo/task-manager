import axios from 'axios';
import * as HelperFunctions from '../common/functions/helperFunctions';
import { TaskModel } from '../models/taskModel';
import { UserModel } from '../models/userModel';

class MainService {
    constructor() {
        axios.defaults.baseURL = "http://localhost:8000/";
        axios.defaults.headers = {
            "Content-Type": "application/json; charset=utf-8",
            Pragma: 'no-cache'
        }
    }

    getUsers() {
        return axios({
            url: `users`,
            method: 'get',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    getUser(id: number) {
        return axios({
            url: `users/${id}`,
            method: 'get',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    updateUser(user: UserModel) {
        return axios({
            url: `users`,
            method: 'put',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: user
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    deleteUser(id: number) {
        return axios({
            url: `users/${id}`,
            method: 'delete',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    getAllTasks() {
        return axios({
            url: `alltasks`,
            method: 'get',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    getAllTasksForUser(id: number) {
        return axios({
            url: `tasksForUser/${id}`,
            method: 'get',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }


    getTask(id: number) {
        return axios({
            url: `task/${id}`,
            method: 'get',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    createTask(task: TaskModel) {
        return axios({
            url: `tasks`,
            method: 'post',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: task
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }

    updateTask(task: TaskModel) {
        return axios({
            url: `tasks`,
            method: 'put',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: task
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }


    deleteTask(id: number) {
        return axios({
            url: `tasks/${id}`,
            method: 'delete',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        })
            .then(res => res.data)
            .catch(error => Promise.reject(HelperFunctions.getErrorMessage(error)));
    }
}

export default MainService;