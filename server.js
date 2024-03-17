const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require('./db');
const app = express()
app.use(bodyParser.json());
const port = 3000

console.log(process.env.DB_PASSWORD)
app.get('/', (req, res) => {
    res.render('index');
    }
);

app.set("view engine" , "ejs");

app.get("/users/register", (req,res) => {
  res.render("register");
});

app.get("/users/login", (req,res) => {
  res.render("login");
});

app.get("/users/dashboard", (req,res) => {
  res.render("dashboard", { user:"Conor"});
});

app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ji_project.music');
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ji_project.users');
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/*
/myapp
  /node_modules
  /public
    /stylesheets
    /javascripts
    /images
  /routes
    /api
      index.js
      users.js
  /models
    user.js
  /controllers
    userController.js
  app.js
  package.json
*/