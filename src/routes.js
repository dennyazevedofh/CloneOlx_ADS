const express = require('express');
const router = express.Router();

const AuthController = require('./controllers/AuthController');

router.get('/ping', (req, res) => {
	res.json({ pong: true });
});

router.post('/user/signin', AuthController.signin);
router.post('/user/signup', AuthController.signup);

module.exports = router;