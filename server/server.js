// Joseph Venetucci

const express = require('express');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');



// const server = express();

// Currently only open the DB if it exists, don't attempt to create it.
const db = new sqlite3.Database('./db/crypto-ts-db.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Unable to find the database file:");
        console.error(err.message);
    } else {
        console.log("Successfully connected to database.");
    }
})

// db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         rows.forEach((row) => {
//             console.log(row);
//         });
//     }
// })

// db.all("SELECT * FROM Users;", (err, rows) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         rows.forEach((row) => {
//             console.log(row);
//         });
//     }
// })

var username = "UserA";
var password = "password";
var salt = crypto.randomBytes(8).toString('hex');

var hash = crypto.createHash('sha256');

hash.update(password + salt);

var hashedPassword = hash.digest('hex');

console.log(username);
console.log(password);
console.log(salt);
console.log(password+salt);
console.log(hashedPassword);

db.run('INSERT INTO Users VALUES (?, ?, ?)', [username, hashedPassword, salt], function (err) {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Added new user to User table row ' + this.lastID);
    }
})

db.close((err) => {
    if (err) {
        console.error("Unable to close the database file:");
        console.error(err.message);
    } else {
        console.log('Close the database connection.');
    }
});

// server.get('/', (req, res) => res.send('Hello World!'));

// server.listen(3001, () => console.log('Example app listening on port 3001!'));