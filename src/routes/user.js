const router = require('express').Router(),
user_controller = require('./controllers/user.controller'),
auth = require('./auth');

var guard = require('express-jwt-permissions')({
    requestProperty: 'identity',
    permissionsProperty: 'scope'
  });

router.get('/', auth.required, user_controller.getAllUsers);

router.post('/login', auth.optional, user_controller.login);

router.post('/register', auth.optional, user_controller.register);

router.post('/token', auth.optional, user_controller.token);

router.get('/search/:vendor?', user_controller.searchVendorUser);

router.get('/:id', user_controller.getUserById);

router.put('/update/:id', auth.required, user_controller.updateUser);

//router.delete('/:id',user_controller.deleteUser);

module.exports = router;