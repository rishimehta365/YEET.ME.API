const router = require('express').Router(),
society_controller = require('./controllers/society.controller');


router.post('/create', society_controller.createSociety);

// router.get('/', user_controller.getAllUsers);

// router.get('/search/:vendor?', user_controller.searchVendorUser);

router.get('/:id', society_controller.getSocietyById);
// router.delete('/:id',user_controller.deleteUser);

// router.get('/find/:term?', auth.optional, schools_controller.getGeoLocSchools);

module.exports = router;