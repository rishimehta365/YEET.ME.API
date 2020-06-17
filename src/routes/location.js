const router = require('express').Router(),
location_controller = require('./controllers/location.controller');


router.post('/create', location_controller.createLocation);

router.get('/:id', location_controller.getLocationById);

router.get('/parent/:id', location_controller.getLocationByParentId);

module.exports = router;