const router = require('express').Router(),
milk_controller = require('./controllers/milk.controller');


router.post('/create', milk_controller.createMilk);

// router.get('/', user_controller.getAllUsers);

// router.get('/search/:vendor?', user_controller.searchVendorUser);

router.get('/:id', milk_controller.getMilkById);
// router.delete('/:id',user_controller.deleteUser);

// router.get('/find/:term?', auth.optional, schools_controller.getGeoLocSchools);

module.exports = router;