const express = require('express');
const router = express.Router();

const AuthValidator = require('./validators/AuthValidator');

const AuthController = require('./controllers/AuthController');

router.get('/ping', (req, res) => {
	res.json({ pong: true });
});

router.post('/user/signin', AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

module.exports = router;