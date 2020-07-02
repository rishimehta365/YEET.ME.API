const router = require('express').Router(),
order_controller = require('./controllers/order.controller'),
auth = require('./auth');

router.post('/create', auth.required, order_controller.createOrder);

router.get('/', auth.required, order_controller.getOrders);

module.exports = router;