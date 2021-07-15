var express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
var fs = require('fs');

// GET login route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

// POST method route
app.post("/login", function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    var matched = false;
    var data = fs.readFileSync('myDB.txt', 'utf8');
    var dataRows = data.split("\n");
    dataRows.forEach(function(row) {
        var rowData = row.split(",");
        var usernameDB = rowData[0];
        var passwordDB = rowData[1];
        if(username.trim().toLowerCase() == usernameDB.trim().toLowerCase() && password.trim().toLowerCase() == passwordDB.trim().toLowerCase()) {
            console.log('matched');
            matched = true;
        }
    });

    if(matched) {
        res.send("<html><body><center><br><h3 style='color:green;'>Welcome : " + username + "</h3><br><a href='/'>Back</a></center></body></html>");
    } else {
        res.send("<html><body><center><br><h4 style='color:red;'>Username Not Found</h4><br><a href='/'>Back</a></center></body></html>");
    }
});

// GET register route
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, '/register.html'));
});

// POST method route
app.post("/register", function (req, res) {
    var username = req.body.username;

    // check duplicate username
    var matched = false;
    var data = fs.readFileSync('myDB.txt', 'utf8');
    var dataRows = data.split("\n");
    dataRows.forEach(function(row) {
        var rowData = row.split(",");
        var usernameDB = rowData[0];
        if(username.trim().toLowerCase() == usernameDB.trim().toLowerCase()) {
            console.log('matched');
            matched = true;
        }
    });

    if(matched ===false) {
        var data = "\n" + req.body.username + "," + req.body.password;

        // add data to file
        fs.appendFile('myDB.txt',data, 'utf8', function(err) {
            if (err) throw err;
            console.log("Register successfully.")
            res.redirect('/');
        });
    } else {
        console.log("Already Register successfully.")
        res.redirect('/');
    }
});

// set port
app.listen(3000, () => console.log("Server ready"));
