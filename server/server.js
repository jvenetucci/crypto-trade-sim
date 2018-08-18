// Joseph Venetucci

const express = require('express');
const sqlite3 = require('sqlite3');

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

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row);
        });
    }
})

db.all("SELECT * FROM Users;", (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row);
        });
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