const router = require('express').Router(),
order_controller = require('./controllers/order.controller');


router.post('/create', order_controller.createOrder);

// router.get('/', user_controller.getAllUsers);

// router.get('/search/:vendor?', user_controller.searchVendorUser);

// router.get('/:id', user_controller.getUserById);
// router.delete('/:id',user_controller.deleteUser);

// router.get('/find/:term?', auth.optional, schools_controller.getGeoLocSchools);

module.exports = router;