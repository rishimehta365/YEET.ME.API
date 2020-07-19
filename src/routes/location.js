const auth = require('./auth'),
router = require('express').Router(),
location_controller = require('./controllers/location.controller');

router.post('/create', auth.optional, location_controller.createLocation);

router.get('/:id', auth.required, location_controller.getLocationById);

router.get('/parent/:id', auth.required, location_controller.getLocationByParentId);

module.exports = router;