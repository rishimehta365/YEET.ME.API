const router = require('express').Router(),
vendor_controller = require('./controllers/vendor.controller'),
auth = require('./auth'),
passport = require('passport');

router.post('/register', auth.optional, vendor_controller.register);

router.post('/login', auth.optional, vendor_controller.login);

router.post('/reset', auth.optional, vendor_controller.resetPassword);

router.post('/forgot', auth.optional, vendor_controller.forgotPassword);

router.get('/googleOAuth', auth.optional, vendor_controller.googleAuth);

router.get('/googleOAuth/redirect', auth.optional, vendor_controller.googleAuthRedirect);

router.post('/googleOAuth20', auth.optional, vendor_controller.googleOAuth20);

router.get('/pub', vendor_controller.pubsub);

router.get('/', auth.required, vendor_controller.getAllVendors);

router.get('/:id', auth.required, vendor_controller.getVendorById);

router.put('/update/:id', auth.required, vendor_controller.updateVendor);

module.exports = router;