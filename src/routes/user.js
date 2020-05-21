const router = require('express').Router(),
user_controller = require('./controllers/user.controller'),
auth = require('./auth');

router.get('/', auth.required, user_controller.getAllUsers);

router.post('/register', auth.optional, user_controller.register);

router.post('/login', auth.optional, user_controller.login);

router.post('/token', auth.optional, user_controller.token);

// router.delete('/logout', auth.required, user_controller.logout);

router.get('/search/:vendor?', user_controller.searchVendorUser);

router.get('/:id', user_controller.getUserById);

router.delete('/:id',user_controller.deleteUser);

module.exports = router;