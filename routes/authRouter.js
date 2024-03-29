import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import pool from "../db.js";

const router = express.Router();

//googleアカウントでログイン
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: "profile",
  })
);

//ログインをしているかどうか確認するAPI
//ログインしているAPI /api/

//ログインしなくても接続できるAPI /without-login-api/
router.get("/public-api/is-logged-in", function (req, res) {
  const loggedIn = req.isAuthenticated();
  res.json({
    loggedIn,
  });
});

router.post("/api/register-mailAdress", async (req, res) => {
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
      `SELECT * FROM ji_project.user
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
            `INSERT INTO ji_project.user (name, email, password)
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

router.post("/api/login-mailAdress", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      // 失敗時のメッサージ.
      return res.status(501).json({ message: "ログイン情報に誤りがあります" });
    }
    // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    // 로그인 성공 시 클라이언트에게 성공을 알리는 응답을 보냅니다.
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "로그인 성공" });
    });
  })(req, res, next);
});

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     session: true,
//     failureRedirect: "/users/login", // 인증 실패 시 리다이렉트할 경로
//     successRedirect: "/users/dashboard" // 인증 성공 시 리다이렉트할 경로
//   }),
// );

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/api/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log('logout done')
    req.flash("success_msg", "You have logged out");
    res.json({
      success:true, 
      message: 'complete logout.'
    })
  });
});

export default router;
