const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
app.use(bodyParser.json());
const port = 3000
const pool = require('./db');
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require('./passportConfig')

initializePassport(passport)

console.log(process.env.DB_PASSWORD)
app.get('/', (req, res) => {
    res.render('index');
    }
);

app.set("view engine" , "ejs");
app.use(express.urlencoded({ extended: false})); 

app.use(session({
  secret: 'secret',

  resave: false,

  saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get("/users/register", (req,res) => {
  res.render("register");
});

app.get("/users/login", (req,res) => {
  res.render("login");
});

app.post("/users/register", async (req,res) => {
  let {name, email, password, password2} = req.body;
  console.log({
    name,
    email,
    password,
    password2
  });

  let errors = [];

  if (!name || !email || !password || !password2){
    errors.push({ massage: "Please enter all fields" });
  }

  if(password.length < 6){
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if(password !== password2){
    errors.push({ message: "Password do not match" });
  }

  if(errors.length > 0){
    res.render("register", { errors });
  }else{
    //入力情報がフォーム様式にしたかったことを確認した後

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM ji_project.users
      WHERE email = $1`, 
      [email], 
      (err, results) => {
        if(err){
          throw err;
        }
        console.log(results.rows);

        if(results.rows.length > 0){
          errors.push({message: "Email already registered"})
          res.render('register', { errors });
        }else{
          pool.query(
            `INSERT INTO ji_project.users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`, [name, email, hashedPassword], 
            (err, results) => {
              if (err){
                throw err;
              }
              console.log(results.row);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login")
            }
          )
        }
      }
    )
  }
});

app.post("/users/login", passport.authenticate('local',{
  successRedirect: "/users/dashboard",
  failureRedirect: "/users/login",
  failureFlash: true
  })
);

app.get("/users/dashboard", (req,res) => {
  res.render("dashboard", { user: req.user.name });
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