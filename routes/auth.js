const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
router.get('/register', authController.signup);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
