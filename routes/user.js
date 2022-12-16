const express = require('express'); // call express
const router = express.Router(); // call router

const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user'); // import controller

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;