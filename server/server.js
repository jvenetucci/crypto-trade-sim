// Joseph Venetucci

const express = require('express');
const sqlite3 = require('sqlite3');

const winston = require('winston');
const morgan = require('morgan');

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

const crypto = require('crypto');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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

/**
 * Register a new user
 * Request Body:
 *  Content-Type: application/json
 *  Required Fields: {username, password}
 *  Optional Fields: {startingAmount}
 * Response:
 *  201 - New user added
 *  400 - Missing username/password in request body
 *  409 - Username already in use
 *  500 - DB problem in trying to set the users starting amount
 */
server.post('/register', jsonParser, (req, res) => {
    // If the request is missing the required params, send 400
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
                logger.info('\tAdded new user to User table row ' + this.lastID);
                let startAmount = req.body.startingAmount || 50000;
                db.run('INSERT INTO Holdings VALUES (?, ?, ?)', [req.body.username, "USD", startAmount], function (err) {
                    if (err) {
                        logger.error(err.message);
                        res.status(500).send("Something happened to the DB, check server logs...");
                    } else {
                        logger.info("\tInitialized " + req.body.username + " with " + startAmount + " USD");
                        res.status(201).send("New user successfully registered");
                    }
                })
            }
        })
    }
});

/**
 * Login a user
 * Request Body:
 *  Content-Type: application/json
 *  Required Fields: {username, password}
 * Response:
 *  200 - Good login
 *  400 - Missing username/password in request body
 *  401 - Username not found or invalid username/password
 *  500 - Something went wrong with the DB
 */
server.post('/login', jsonParser, (req, res) => {
    // If the request is missing either the username or password, send 400
    if (!req.body.username || !req.body.password) { 
        res.status(400).send("Missing Username/Password");
    } else {
        logger.info("Attempting to login user " + req.body.username);

        db.get('SELECT * FROM Users WHERE username = ?', [req.body.username], function (err, row) {
            if (err) {
                logger.error(err.message);
                res.status(500).send("Something happened to the DB, check server logs...");
            } else {
                if (row) {
                    var hash = crypto.createHash('sha256');
                    hash.update(req.body.password + row.salt);
                    var hashedPassword = hash.digest('hex');
                    if (row.password_hash !== hashedPassword) {
                        // Invalid Password
                        logger.info("\t" + req.body.password + " is incorect password.");
                        res.status(401).send("Invalid username/password"); 
                    } else {
                        logger.info("\t" + req.body.username + " is logged in");
                        res.status(200).send("Log in successful");
                    }
                } else {
                    // User does not exist
                    logger.info("\t" + req.body.username + " does not exist.");
                    res.status(401).send("Invalid username/password");
                }
            }
        })
    }
});

/**
 * Retrieve an array of a users current holdings with current values. Will send an empty array if the user does not exist.
 * Query String:
 *  username - The user to get holdings for
 * Response:
 *  200 - Good login
 *  400 - Missing username is query string
 *  500 - Something went wrong with the DB
 */
server.get('/holdings', (req, res) => {
    if (!req.query.username) {
        res.status(400).send("Missing username parameter");
    } else {
        db.all('SELECT currency, quantity FROM Holdings WHERE username = ?', [req.query.username], (err, row) => {
            if (err) {
                logger.error(err.message);
                res.status(500).send("Something happened to the DB, check server logs...");
            } else {
                res.json(row);
            }
        })
    }
})

server.listen(3001, () => logger.info('Example app listening on port 3001!'));

// db.close((err) => {
//     if (err) {
//         logger.error("Unable to close the database file:");
//         logger.error(err.message);
//     } else {
//         logger.info('Close the database connection.');
//     }
// });