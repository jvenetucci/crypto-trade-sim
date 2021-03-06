// Joseph Venetucci

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const morgan = require('morgan');
const winston = require('winston');
const axios = require('axios');

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

// Authenticate a user using Passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        logger.info("Attempting to login user " + username);
        db.get('SELECT * FROM Users WHERE username = ?', [username], function (err, row) {
            if (err) {
                logger.error(err.message);
                return done(err);
            } else {
                if (row) {
                    var hash = crypto.createHash('sha256');
                    hash.update(password + row.salt);
                    var hashedPassword = hash.digest('hex');
                    if (row.password_hash !== hashedPassword) {
                        logger.info("\t" + password + " is incorect password.");
                        return done(null, false, {message: "Invalid username/password"});
                    } else {
                        logger.info("\t" + username + " is logged in");
                        return done(null, username);
                    }
                } else {
                    logger.info("\t" + username + " does not exist.");
                    return done(null, false, {message: "Invalid username/password"});
                }
            }
        })
    }
))

// Since using memory store, this is a basic serialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Since using memory store, this is a basic deserialize
passport.deserializeUser(function(id, done) {
    done(null, id);
});

// This is a basic middleware function that checks if the user field has been set in request.
// This will get set if the user goes through the login endpoint with correct credentials.
function isUserLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        console.log("Unauthorized request to " +  req.route.path + " from " + req._remoteAddress);
        res.status(401).send("You must be logged in to access this endpoint");
    }
}

const server = express();
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(session({
    secret: 'crypto-ts-secrect',
    resave: true,
    saveUninitialized: true  
}))
server.use(passport.initialize());
server.use(passport.session());

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
 * Login a user through passport and custom callback.
 * Request Body:
 *  Content-Type: application/json
 *  Required Fields: {username, password}
 * Response:
 *  200 - Good login
 *  401 - Bad login information
 *  500 - DB or session error - See logs
 */
server.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).send("Something happened to the DB, check server logs...")
        }
        if (!user) { 
            return res.status(401).send(info.message); 
        } else {
            req.logIn(user, function(err) {
                if (err) { 
                    res.status(500).send("Something happened, check server logs...") 
                }
                return res.status(200).send("Log in successful");
            });
        }
    })(req, res, next)
});

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
server.post('/register', (req, res) => {
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
 * Logs a user out.
 * Response:
 *  200 - Logged out, Client should redirect themselves.
 */
server.get('/logout', function(req, res){
    logger.info(req.user + " is logging out");
    req.logout();
    res.sendStatus(200);
});

/**
 * Buy an amount of cryptocurrency for USD. This is a protected endpoint
 * Request Body:
 *  Content-Type: application/json
 *  Required Fields: {currency, quantity, price}
 * Response:
 *  200 - Successful purchase
 *  400 - Missing required fields in request body
 *  404 - User or USD holdings can't be found
 *  409 - Not Enough money
 *  500 - Something went wrong with the DB
 */
server.post('/buy', isUserLoggedIn, (req, res) => {
    if (!req.body.quantity || !req.body.currency || !req.body.price) { 
        res.status(400).send("Missing required fields in body");
    } else {
        logger.info(req.user +" is attempting to buy " + req.body.quantity +
            " " + req.body.currency + " for " + req.body.price);
        db.get('SELECT quantity FROM Holdings WHERE username = ? AND currency = ?', [req.user, "USD"], function (err, row) {
            if (err) {
                logger.error(err.message);
                res.status(500).send("Something happened to the DB, check server logs...");
            } else {
                if (row) {
                    if (row.quantity < req.body.price) {
                        logger.info("\t" + "Buy amount is " + req.body.price + " but user only has " + row.quantity);
                        res.status(409).send("Not enough funds to purchase"); 
                    } else {
                        logger.info("\t" + "purchasing...");
                        var newBalance = row.quantity - req.body.price;
                        db.serialize(() => {
                            db.run('BEGIN TRANSACTION');
                            db.run('INSERT INTO Transactions VALUES (?, ?, ?, ?, ?, ?, ?)',
                              [req.user, Date.now(), "BUY", req.body.currency, "USD", req.body.quantity, req.body.price], (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    logger.error(err.message);
                                    res.status(500).send("Something happened to the DB, check server logs...");
                                }
                            });
                            db.run('UPDATE Holdings SET quantity = quantity + ? WHERE username = ? AND currency = ?',
                             [req.body.quantity, req.user, req.body.currency], function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    logger.error(err.message);
                                    res.status(500).send("Something happened to the DB, check server logs...");
                                } else if (this.changes == 0) {
                                    db.run('INSERT INTO Holdings VALUES (?, ?, ?)', 
                                      [req.user, req.body.currency, req.body.quantity], (err) => {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            logger.error(err.message);
                                            res.status(500).send("Something happened to the DB, check server logs...");
                                        } 
                                    })
                                }
                            });
                            db.run('UPDATE Holdings SET quantity = ? WHERE username = ? AND currency = ?', 
                              [newBalance, req.user, "USD"], (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    logger.error(err.message);
                                    res.status(500).send("Something happened to the DB, check server logs...");
                                }
                            });
                            db.run('COMMIT');
                        })
                        logger.info("\t" + "purchase successful");
                        res.status(200).send("Purchase successful");
                    }
                } else {
                    // User does not exist, or no existing record for USD
                    logger.info("\t" + "Can't get USD holdings for " + req.body.username);
                    res.status(404).send("Cannot find user or user's USD holdings");
                }
            }
        })
    }
});

/**
 * Retrieve an array of a users current holdings with current values. Will send an empty array if the user does not exist.
 * Uses the username stored in the current session. This is a protected endpoint.
 * Response:
 *  200 - Found holdings
 *  500 - Something went wrong with the DB
 */
server.get('/holdings', isUserLoggedIn, (req, res) => {
    logger.info(req.user + " is asking for their current holdings");
    db.all('SELECT currency, quantity FROM Holdings WHERE username = ?', [req.user], (err, row) => {
        if (err) {
            logger.error(err.message);
            res.status(500).send("Something happened to the DB, check server logs...");
        } else {
            var query = ''
            row.forEach((holding) => {
                query += holding.currency + ','
            })
            var queryString = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + query + '&tsyms=USD';
            axios.get(queryString)
            .then((response) => {
                row.forEach((holding) => {
                    holding.price = response.data[holding.currency]['USD'] * holding.quantity
                })
                res.json(row);
            })
        }
    })
});

/**
 * Retrieve coin info from API
 * Response:
 *  200 - Coin in response body
 */
server.get('/coin', isUserLoggedIn, (req, res) => {
    if (!req.query.coin) { 
        res.status(400).send("Missing required fields in body");
    } else {
        logger.info(req.user + " is asking for the price of " + req.query.coin);
        var queryString = 'https://min-api.cryptocompare.com/data/price?fsym=' + req.query.coin + '&tsyms=USD'
        axios.get(queryString)
        .then((response) => {
            res.json(response.data);
        })
    }
    // console.log(req.query.coin);
});

/**
 * Retrieve the transaction history of a user. Will return an empty array if there are no transactions, or the user does not exist.
 * Uses the username stored in the current session. This is a protected endpoint.
 * Response:
 *  200 - Found history
 *  500 - Something went wrong with the DB
 */
server.get('/history', isUserLoggedIn, (req, res) => {
    logger.info(req.user + " is asking for their transaction history");
    db.all('SELECT * FROM Transactions WHERE username = ? ORDER BY date DESC', [req.user], (err, row) => {
        if (err) {
            logger.error(err.message);
            res.status(500).send("Something happened to the DB, check server logs...");
        } else {
            res.json(row);
        }
    })
});

server.listen(3001, () => logger.info('Example app listening on port 3001!'));

// db.close((err) => {
//     if (err) {
//         logger.error("Unable to close the database file:");
//         logger.error(err.message);
//     } else {
//         logger.info('Close the database connection.');
//     }
// });