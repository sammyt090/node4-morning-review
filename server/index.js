require('dotenv').config()
const massive= require('massive')
const express = require('express')

const cors = require('cors')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const app = express()
const middleware = require ('./middleware/middleware')
const authCtr1 = require ('./controllers/authController')

app.use(cors())
app.use(express.json())


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000*60*60*24}
}))


app.post('/auth/register', middleware.checkUsername, authCtr1.register)
app.post('./auth/login', middleware.checkUsername, authCtr1.login)
app.post('/auth/logout', authCtr1.logout)
app.get('/auth/user', authCtr1.getUser)



massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log("DB CONNECTED")
    app.listen(SERVER_PORT, () => console.log(`Up and running on ${SERVER_PORT}`))
})
