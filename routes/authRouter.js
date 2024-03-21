const express = require("express");
const router = express.Router();
const passport = require("passport")

//googleアカウントでログイン
router.get(
  "/google",
  passport.authenticate("google", {
    scope: "profile",
  })
);

router.get(
  "/google/callback", 
  passport.authenticate("google", {
    session: true,
    failureRedirect: "/users/login", // 인증 실패 시 리다이렉트할 경로
    successRedirect: "/users/dashboard" // 인증 성공 시 리다이렉트할 경로
  }), 
);

module.exports = router;
