
import playlistRouter from './routes/playlistRouter.js';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();
import pool from "./db.js";
// import "./auth.js"

const app = express()
const port = 3011

app.use(bodyParser.json());

app.use(bodyParser.json());
app.options("*", cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 }));
app.use('/api/playlist', playlistRouter);

app.get("/users/register_mailAdress", checkAuthenticated, (req, res) => {
  res.render("register_mailAdress");
});

app.get("/users/register_googleAccount", checkAuthenticated, (req, res) => {
  res.render("register_googleAccount");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You have logged out");
    res.redirect("/users/login");
  });
});

app.post("/users/register_googleAccount", (req, res)=>{
  res.redirect('/auth/google');
})

app.post("/users/register_mailAdress", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  console.log({
    name,
    email,
    password,
    password2,
  });

  let errors = [];

  //新規加入に必要な情報が入っていない場合
  if (!name || !email || !password || !password2) {
    errors.push({ massage: "Please enter all fields" });
  }

  //新規加入パスワードの長さを６文字以上にする
  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  //新規加入パスワードとパスワード確認用を確認する
  if (password !== password2) {
    errors.push({ message: "Password do not match" });
  }

  if (errors.length > 0) {
    res.render("register_mailAdress", { errors });
  } else {
    //入力情報がフォーム様式にしたかったことを確認した後
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM ji_project.users
      WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register_mailAderss", { errors });
        } else {
          pool.query(
            `INSERT INTO ji_project.users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

app.get("/data", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM ji_project.music");
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM ji_project.users");
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})