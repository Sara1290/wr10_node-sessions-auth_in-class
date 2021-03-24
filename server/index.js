require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive');
const { PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;
const session = require('express-session')
const authCtrl = require('./controllers/authCtrl')
const authenticateUser = require('./middlewares/authenticateUser')

app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

//AUTH ENDPOINTS
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.delete('/auth/logout', authCtrl.logout)
//protected endpoint
app.get('/api/secret', authenticateUser, (req, res) => {
    res.status(200).send("Here's the Secret!")
})

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
.then(dbInstance =>{
    app.set('db', dbInstance)
    app.listen(PORT, () => console.log(`DB up & Server running on ${PORT}`))
})
.catch(err => console.log(err))























//    THIS IS SERVER SET UP BEFORE WE DO ENDPOINTS OR ADD SESSIONS, THIS IS BASIC SKELETON SET UP FOR A SERVER NOW //
// require('dotenv').config()
// const express = require('express')
// const app = express()
// const massive = require('massive');
// const { PORT, CONNECTION_STRING} = process.env;

// app.use(express.json())

// massive({
//     connectionString: CONNECTION_STRING,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })
// .then(dbInstance =>{
//     app.set('db', dbInstance)
//     app.listen(PORT, () => console.log(`Server running on ${PORT}`))
// })
// .catch(err => console.log(err))


