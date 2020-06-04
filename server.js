
const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./db/db.json')
const database = JSON.parse(fs.readFileSync('./db/db.json'))


server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token 
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({ username, password }) {
    return database.users.findIndex(user => user.username === username && user.password === password) !== -1
}

function getUser({ username, password }) {
    return database.users.find(user => user.username === username && user.password === password);
}

// Register New User
server.post('/auth/register', (req, res) => {
    console.log("register endpoint called; request body:");
    console.log(req.body);
    const { username, password, firtsName, lastName } = req.body;

    if (database.users.find(user => user.username === username)) {
        const status = 401;
        const message = 'Username already exist';
        res.status(status).json({ status, message });
        return
    }

    var last_item_id = database.users[database.users.length - 1].id;
    database.users.push({ id: last_item_id + 1, username: username, password: password, firtsName: firtsName, lastName: lastName, isAdmin: false });

    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        //Add new user
        data.users.push({ id: last_item_id + 1, username: username, password: password, firtsName: firtsName, lastName: lastName, isAdmin: false }); //add some data
        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }

        });
    });

    // Create token for new user
    res.status(200).json(true)
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
    console.log("login endpoint called; request body:");
    console.log(req.body);
    const { username, password } = req.body;
    if (isAuthenticated({ username, password }) === false) {
        const status = 401
        const message = 'Incorrect username or password'
        res.status(status).json({ status, message })
        return
    }
    const user = getUser({ username, password });
    const access_token = createToken({ username, password, isAdmin: user.isAdmin, id: user.id })
    console.log("Access Token:" + access_token);
    res.status(200).json({ access_token })
})

server.put('/users', (req, res) => {
    const user = req.body;
    console.log('update user')
    const userIndex = database.users.findIndex(userdb => userdb.id === user.id);
    if (userIndex === -1) {
        const status = 404
        const message = 'user not found'
        res.status(status).json({ status, message })
        return
    }

    database.users.splice(userIndex, 1, user)

    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        //Add new user
        data.users.splice(userIndex, 1, user); //add some data
        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }
        });
    });
    res.status(200).json(true)
})


server.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    console.log("Delete by id ", id);
    const userIndex = database.users.findIndex(user => user.id === +id);
    if (userIndex === -1) {
        const status = 404
        const message = 'User not found'
        res.status(status).json({ status, message })
        return
    }
    //remove from instance that is in this file
    database.users.splice(userIndex, 1);


    //remove from file
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());
        let tasks = database.tasks.filter(r => r.userId === +id);
        if (tasks && tasks.length > 0) {
            for (let task of tasks) {
                let indx = database.tasks.indexOf(task);
                if (indx > -1) {
                    database.tasks.splice(indx, 1);
                    data.tasks.splice(indx, 1);
                }
            }
        }

        data.users.splice(userIndex, 1);
        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }
        });
    });

    res.status(200).json(true)
})

server.get('/users', (req, res) => {
    console.log('Get users');
    const users = database.users;
    res.status(200).json({ users });
});

server.get('/users/:id', (req, res) => {
    let id = req.params.id;
    console.log('Get user by id ' + id);
    const user = database.users.find(user => user.id === +id);
    if (!user || user === undefined) {
        const status = 404
        const message = 'user not found'
        res.status(status).json({ status, message })
        return
    }
    res.status(200).json({ user });
});


server.get('/alltasks', (req, res) => {
    console.log('Get tasks');
    const tasks = database.tasks;
    for (let task of tasks) {
        let user = database.users.find(r => r.id === task.userId);
        if (user)
            task.forUser = user.username;
    }
    res.status(200).json({ tasks });
});

server.get('/tasksForUser/:id', (req, res) => {
    let id = req.params.id;
    console.log('Get tasks ' + id);
    const tasks = database.tasks.filter(r => r.userId === +id);
    res.status(200).json({ tasks });
});

server.get('/task/:id', (req, res) => {
    let id = req.params.id;
    console.log('Get task by id ' + id);
    const task = database.tasks.find(task => task.taskId === +id);
    if (!task || task === undefined) {
        const status = 404
        const message = 'task not found'
        res.status(status).json({ status, message })
        return
    }
    res.status(200).json({ task });
});

server.post('/tasks', (req, res) => {
    const task = req.body;
    console.log('create task')
    var last_item_id = database.tasks.length;
    task.taskId = database.tasks[last_item_id - 1].taskId + 1;
    database.tasks.push(task);
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        //Add new user
        data.tasks.push(task); //add some data
        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }
        });
    });
    res.status(200).json(true)
})

server.put('/tasks', (req, res) => {
    const task = req.body;
    console.log('update task')
    const taskIndex = database.tasks.findIndex(taskdb => taskdb.taskId === task.taskId);
    if (taskIndex === -1) {
        const status = 404
        const message = 'task not found'
        res.status(status).json({ status, message })
        return
    }

    database.tasks.splice(taskIndex, 1, task)

    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        //Add new user
        data.tasks.splice(taskIndex, 1, task); //add some data
        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }
        });
    });
    res.status(200).json(true)
})

server.delete('/tasks/:id', (req, res) => {
    let id = req.params.id;
    console.log("Delete by id ", id);
    const taskIndex = database.tasks.findIndex(task => task.taskId === +id);
    if (taskIndex === -1) {
        const status = 404
        const message = 'task not found'
        res.status(status).json({ status, message })
        return
    }
    //remove from instance that is in this file
    database.tasks.splice(taskIndex, 1);

    //remove from file
    fs.readFile("./db/db.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({ status, message })
            return
        };

        // Get current users data
        var data = JSON.parse(data.toString());

        data.tasks.splice(taskIndex, 1);

        var writeData = fs.writeFile("./db/db.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({ status, message })
                return
            }
        });
    });

    res.status(200).json(true)
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Error in authorization format'
        res.status(status).json({ status, message })
        return
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

        if (verifyTokenResult instanceof Error) {
            const status = 401
            const message = 'Access token not provided'
            res.status(status).json({ status, message })
            return
        }
        next()
    } catch (err) {
        const status = 401
        const message = 'Error access_token is revoked'
        res.status(status).json({ status, message })
    }
})

server.use(router)

server.listen(8000, () => {
    console.log('Run Auth API Server')
})