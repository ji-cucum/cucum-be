import playlistRouter from './routes/playlistRouter.js';
import musicRouter from './routes/musicRouter.js';
import imageRouter from './routes/imageRouter.js';
import cors from 'cors';
import express from 'express';
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
import session from 'express-session';
import flash from 'express-flash';
import initializePassport from './passportConfig.js'
import authRouter from './routes/authRouter.js'
import bodyParser from 'body-parser';

dotenv.config();
import pool from "./db.js";
import "./auth.js"

const app = express()
const port = 3011

app.use(bodyParser.json());
app.options("*", cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:5173", optionsSuccessStatus: 200, credentials: true}));

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

app.use('/api/music', musicRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/image', imageRouter);

app.get("/api/register-mailAdress", (req, res) => {
  res.send(401);
});

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
