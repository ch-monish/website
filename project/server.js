const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const mysql = require("mysql")
const cookieParser = require('cookie-parser')
require("dotenv").config()

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err) {
        console.log("connected to database");
    }
    else {
        console.log("error while connecting to database")
        console.log(err);
    }
})


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


var options = {
    host: "localhost",
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
};

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'secret',
    store: sessionStore,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 1 },
    saveUninitialized: false
}));



app.post('/load', (req, res) => {
    if (req.session.authenticated == true) {
        req.session.message = "login successfull"
        res.send(req.session)
    }
    else {
        req.session.message = "session not started"
        res.send(req.session)
    }
})

app.post('/login', (req, res) => {

    console.log(req.body)
    username = req.body.username
    password = req.body.password
    let sql = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
    // console.log(sql)
    mysqlConnection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.send({ "message": err })
        }
        else {
            console.log(result)
            if (result != "") {

                req.session.authenticated = true
                req.session.user = username
                // console.log("authenticated =" + req.session.authenticated)
                console.log("------------------------------------------------------------------------------")
                console.log(req.sessionID)
                var sessionid = req.sessionID
                console.log(sessionStore)
                console.log("login success\n---------------------------------------------------------------")
                req.session.authenticated = true
                res.cookie("sessionID", sessionid)
                res.send({ "message": "login successfull", })
            }
            else {
                console.log("Incorrect credentials\n---------------------------------------------------------------")
                res.send({ "message": "Incorrect credentials" })
            }
        }

    })

})



app.listen(process.env.port, () => {
    console.log("server started")
})
