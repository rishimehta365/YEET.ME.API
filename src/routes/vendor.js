const router = require('express').Router(),
vendor_controller = require('./controllers/vendor.controller');


router.post('/create', vendor_controller.createVendor);

router.get('/', vendor_controller.getAllVendors);

// router.get('/search/:term?', auth.optional, schools_controller.searchSchool);

router.get('/:id', vendor_controller.getVendorById);
// router.delete('/:id',user_controller.deleteUser);

// router.get('/find/:term?', auth.optional, schools_controller.getGeoLocSchools);

module.exports = router;