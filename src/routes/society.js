const router = require('express').Router(),
society_controller = require('./controllers/society.controller'),
auth = require('./auth');


router.post('/create', auth.required, society_controller.createSociety);

router.get('/', auth.required, society_controller.getAllSocieties);

router.get('/:id', auth.required, society_controller.getSocietyById);

router.put('/update/:id', auth.required, society_controller.updateSociety);

module.exports = router;