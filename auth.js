const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
require("dotenv").config();
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      const account = profile._json;
      let user = {};
      try {
        const currentUserQuery = await pool.query(
          "SELECT * FROM ji_project.users WHERE email = $1 ",
          [account.sub]
        );
        if (currentUserQuery.rows.length === 0) {
          //ユーザー作成
          await pool.query(
            "INSERT INTO ji_project.users (name, email) VALUES ($1,$2)",
            [account.name, account.sub]
          );
          const id = await pool.query(
            "SELECT id FROM ji_project.users WHERE google_id=$1",
            [account.sub]
          );
          user = {
            id,
            username: account.name,
            img: account.picture,
          };
        } else {
          //既存ユーザー
          user = {
            id: currentUserQuery.rows[0].id,
            username: currentUserQuery.rows[0].username,
            img: account.picture,
          };
        }
        //既存ユーザー
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
