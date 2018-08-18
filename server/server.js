// Joseph Venetucci

const express = require('express');
const sqlite3 = require('sqlite3');
const winston = require('winston');
const crypto = require('crypto');


const logFormat = winston.format.printf(info => {
    return info.timestamp +  " [" + info.level + "]: " + info.message;
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({format: 'MM-DD-YYYY HH:mm:ss'}),
                logFormat
            )
        }),
    ]
});

// const server = express();

// Currently only open the DB if it exists, don't attempt to create it.
const db = new sqlite3.Database('./db/crypto-ts-db.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        logger.error("Unable to find the database file:");
        logger.error(err.message);
    } else {
        logger.info("Successfully connected to database.");
    }
})

// db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
//     if (err) {
//         logger.error(err.message);
//     } else {
//         rows.forEach((row) => {
//             logger.info(row);
//         });
//     }
// })

// db.all("SELECT * FROM Users;", (err, rows) => {
//     if (err) {
//         logger.error(err.message);
//     } else {
//         rows.forEach((row) => {
//             logger.info(row);
//         });
//     }
// })

var username = "UserA";
var password = "password";
var salt = crypto.randomBytes(8).toString('hex');

var hash = crypto.createHash('sha256');

hash.update(password + salt);

var hashedPassword = hash.digest('hex');

logger.info(username);
logger.info(password);
logger.info(salt);
logger.info(password+salt);
logger.info(hashedPassword);

// db.run('INSERT INTO Users VALUES (?, ?, ?)', [username, hashedPassword, salt], function (err) {
//     if (err) {
//         logger.error(err.message);
//     } else {
//         logger.info('Added new user to User table row ' + this.lastID);
//     }
// })

db.close((err) => {
    if (err) {
        logger.error("Unable to close the database file:");
        logger.error(err.message);
    } else {
        logger.info('Close the database connection.');
    }
});

// server.get('/', (req, res) => res.send('Hello World!'));

// server.listen(3001, () => logger.info('Example app listening on port 3001!'));