const express = require('express');
const passport = require('passport');
const { signToken } = require('../auth.service');
const router = express.Router();

router.get('/', 
  passport.authenticate('google', {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    approvalPrompt: "force"
  })
);

// callback url upon successful google authentication
router.get(
  '/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log("callback");
    // console.log(req.user);
    // console.log(req.user.id);
    const token = signToken(req.user.id, req.user._json.email);
    res.json({ token });
  }
);

module.exports = router;