const express = require('express');
const router = express.Router();

const AuthValidator = require('./validators/AuthValidator');
const UserValidator = require('./validators/UserValidator');
const Auth = require('./middlewares/Auth');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const AdsController = require('./controllers/AdsController');

router.get('/ping', (req, res) => {
	res.json({ pong: true });
});

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/states', UserController.getStates);
router.get('/categories', AdsController.getCategories);

router.post('/ad/add', Auth.private, AdsController.AddAction);
router.get('/ad/list', AdsController.getList);
router.get('/ad/item', AdsController.getItem);
router.put('/ad/:id', Auth.private, AdsController.editAction);

router.get('/user/me', Auth.private, UserController.info);
router.put('/user/me', UserValidator.editAction, Auth.private, UserController.editAction);

module.exports = router;