import express from "express";
import passport from "passport"

const router = express.Router();

//googleアカウントでログイン
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: "profile",
  })
);

router.get(
  "/auth/google/callback", 
  passport.authenticate("google", {
    session: true,
    failureRedirect: "/users/login", // 인증 실패 시 리다이렉트할 경로
    successRedirect: "/users/dashboard" // 인증 성공 시 리다이렉트할 경로
  }), 
);

//ログインをしているかどうか確認するAPI
//ログインしているAPI /api/

//ログインしなくても接続できるAPI /without-login-api/
router.get(
  "/public-api/is-logged-in",
  function(req, res){
    const loggedIn = req.isAuthenticated()
    res.json({
      loggedIn
    })
  }
)


export default router;
