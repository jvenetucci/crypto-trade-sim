// Joseph Venetucci

const express = require('express');
const sqlite3 = require('sqlite3');
const winston = require('winston');
const morgan = require('morgan');
const crypto = require('crypto');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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

const server = express();
server.use(morgan('dev'));


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

// var username = "UserA";
// var password = "password";
// var salt = crypto.randomBytes(8).toString('hex');

// var hash = crypto.createHash('sha256');

// hash.update(password + salt);

// var hashedPassword = hash.digest('hex');

// logger.info(username);
// logger.info(password);
// logger.info(salt);
// logger.info(password+salt);
// logger.info(hashedPassword);

// db.run('INSERT INTO Users VALUES (?, ?, ?)', [username, hashedPassword, salt], function (err) {
//     if (err) {
//         logger.error(err.message);
//     } else {
//         logger.info('Added new user to User table row ' + this.lastID);
//     }
// })

// db.close((err) => {
//     if (err) {
//         logger.error("Unable to close the database file:");
//         logger.error(err.message);
//     } else {
//         logger.info('Close the database connection.');
//     }
// });


server.post('/', jsonParser, (req, res) => {

    res.send(req.body)
});

/**
 * Register a new user
 * Request Body:
 *  Content-Type: application/json
 *  Required Fields: {username, password}
 * Response:
 *  201 - New user added
 *  400 - Missing username/password in request body
 *  409 - Username already in use
 */
server.post('/register', jsonParser, (req, res) => {
    // If the request is missing either the username or password, send 400
    if (!req.body.username || !req.body.password) { 
        res.status(400).send("Missing Username/Password");
    } else {
        var salt = crypto.randomBytes(8).toString('hex');
        var hash = crypto.createHash('sha256');
        hash.update(req.body.password + salt);
        var hashedPassword = hash.digest('hex');

        logger.info("Attempting to add new user " + req.body.username);

        db.run('INSERT INTO Users VALUES (?, ?, ?)', [req.body.username, hashedPassword, salt], function (err) {
            if (err) {
                logger.error(err.message);
                res.status(409).send("Username already in use");
            } else {
                logger.info('Added new user to User table row ' + this.lastID);
                res.status(201).send("New user successfully registered");
            }
        })
    }
});

server.listen(3001, () => logger.info('Example app listening on port 3001!'));