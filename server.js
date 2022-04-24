const express = require('express');
const session = require('express-session');
const cors = require('cors');

const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const port = '3000';

//users
let users = [{username:'user', password:'password'}];

// SERVER STARTUP ------------------------------------------------------------
//create express server
const app = express();
app.use(cors()); //enables all cors
app.use(session({secret:'secret key'})); //session middleware
app.use(express.static(path.join(__dirname,"/")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    next();
});

//start server
app.listen(port, () => {
    console.log(`Server started. Listening on port ${port}...`);
});

//create database connection
const db = mysql.createConnection({
    host: "35.225.59.171",
    user: "james",
    password: "0123456789",
    database: "JustBeClaws"
});

// connect to database
db.connect((err) => {
    if(err) console.log('Error: ', err.message);
    else console.log('Connected to database...');

})

// END Points ----------------------------------------------------------------
//login
app.post('/login', (req,res) => {
    //query list of users
    let sql = 'SELECT username, password FROM Users';
    let users = [];
    db.query(sql, (err,result) => {
        if(err)throw err;

        //compare each user to given credentials
        result.forEach(user => {
            if(user.username == req.body.username && user.password == req.body.password) {
                console.log("LOGGED IN as, ",user.username);

                //create session user
                req.session.user = user;
                res.redirect('/');
            }
        });
    });
});


//home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/homePage.html"));

    //check which user is logged in, if any
    if(req.session.user) {
        console.log(user);
    }
});

//get full list of orders
app.get('/auth-login', (req, res) => {
    console.log('hi');
    let sql = "SELECT administrator, adopter, foster FROM Users WHERE username = '$username' AND password = '$password'";
    db.query(sql, (err, result) => {
        
        if(err) throw err;
        console.log(result);
        console.log(result[0].name);
        res.send(JSON.stringify(result));
    }); 
});


