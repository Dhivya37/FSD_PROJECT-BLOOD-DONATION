const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'donors'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for parsing application/json
app.use(bodyParser.json());

// Route for handling signup form submission
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
    console.log(name, email, password);
  // Check if the email already exists in the database
  const checkEmailQuery = `SELECT * FROM signup WHERE email = '${email}'`;
  db.query(checkEmailQuery, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      // If email already exists, send response indicating duplicate registration
      return res.status(400).send('You have already registered.');
    } else {
      // If email does not exist, insert new user data into the database
      const insertQuery = `INSERT INTO signup (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
      db.query(insertQuery, (err, result) => {
        if (err) {
          throw err;
        }
        // Send response indicating successful registration
        res.status(200).send('Registration successful!');
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
