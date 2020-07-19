const router = require('express').Router(),
order_controller = require('./controllers/order.controller'),
auth = require('./auth');

router.post('/create', auth.optional, order_controller.createOrder);

router.get('/', auth.required, order_controller.getOrders);

router.get('/:id', auth.optional, order_controller.getOrderById);

//router.put('/update/:id', auth.required, order_controller.updateOrder);

module.exports = router;