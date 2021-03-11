const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const mysql = require("mysql")
require("dotenv").config()



var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err) {
        console.log("connected");
    }
    else {
        console.log("error while connecting to database")
        console.log(err);
    }
})


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.post('/', (req, res) => {
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
                console.log("login success\n---------------------------------------------------------------")
                res.send({ "message": "login successful" })
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