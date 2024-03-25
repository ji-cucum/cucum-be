import playlistRouter from './routes/playlistRouter.js';
import express from 'express';
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import passport from "passport";
import dotenv from "dotenv";
import session from 'express-session';
import flash from 'express-flash';
import initializePassport from './passportConfig.js'
import authRouter from './routes/authRouter.js'
import bodyParser from 'body-parser';
import cors from 'cors'

dotenv.config();
import pool from "./db.js";
import "./auth.js"

const app = express()
const port = 3011

app.use(bodyParser.json());
app.options("*", cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200 }));

app.use(cookieParser())
app.use(express.json());

initializePassport(passport);

app.use(express.urlencoded({extended: false}));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/api/*", checkAuthenticated);

app.use(authRouter);

app.use('/api/playlist', playlistRouter);

app.get("/api/register-mailAdress", (req, res) => {
  res.send(401);
});

app.get("/api/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You have logged out");
    res.redirect("/api/login_mailAdress");
  });
});

app.post("/api/register-googleAccount", (req, res)=>{
  res.redirect('/auth/google');
})

app.post("/api/register-mailAdress", async (req, res) => {
  let { name, email, password, password_confirm } = req.body;
  console.log({
    name,
    email,
    password,
    password_confirm,
  });
  
  let errors = [];

  if (errors.length > 0) {
    return res.status(500).json({ errors });
 
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
          errors.push({ message: "登録済みのメールアドレスです" });
          return res.status(500).json({ errors });

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
              res.status(200).send("User registered successfully");
            }
          );
        }
      }
    );
  }
});

app.post("/api/login-mailAdress", (req, res, next) => {
  req.login(null, ()=>{
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      console.log(user)
      if (!user) {
        // 失敗時のメッサージ.
        return res.status(501).json({ message: "ログイン情報に誤りがあります" });
      }
      // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
      // 로그인 성공 시 클라이언트에게 성공을 알리는 응답을 보냅니다.
      return res.status(200).json({ message: "로그인 성공"});
    })(req, res, next);
  });
})

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
  next();
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})