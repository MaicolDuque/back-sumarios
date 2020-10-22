const express = require('express');
const passport = require('passport');
const { signToken } = require('../auth.service');
const router = express.Router();
const { URL_FRONT } = require('../../config')

router.get('/',
  passport.authenticate('google', {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force"
  })
);

// when login is successful, retrieve user info
router.get("/success", (req, res) => {
  if (req.user) {
    const user = req.user
    const token = signToken(req.user.id, req.user._json.email);
    res.json({ token, user });
  }
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get('/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
})

// callback url upon successful google authentication
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failed' }),
  (req, res) => {
    res.redirect(URL_FRONT)
  }
);



module.exports = router;