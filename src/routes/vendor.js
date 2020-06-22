const router = require('express').Router(),
vendor_controller = require('./controllers/vendor.controller'),
auth = require('./auth');

router.post('/register', auth.optional, vendor_controller.register);

router.post('/login', auth.optional, vendor_controller.login);

router.post('/reset', auth.optional, vendor_controller.resetPassword);

router.post('/forgot', vendor_controller.forgotPassword);

router.get('/', auth.required, vendor_controller.getAllVendors);

router.get('/:id', auth.required, vendor_controller.getVendorById);

router.put('/update/:id', auth.required, vendor_controller.updateVendor);

module.exports = router;