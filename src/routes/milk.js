const router = require('express').Router(),
milk_controller = require('./controllers/milk.controller'),
auth = require('./auth');


router.post('/create', auth.required, milk_controller.createMilk);

router.get('/', milk_controller.getAllMilk);

// router.get('/search/:vendor?', user_controller.searchVendorUser);

router.get('/:id', auth.required, milk_controller.getMilkById);

router.put('/update/:id',milk_controller.updateMilk);

// router.get('/find/:term?', auth.optional, schools_controller.getGeoLocSchools);

module.exports = router;