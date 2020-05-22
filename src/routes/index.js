const express = require('express');
const router = express.Router();
router.use('/api/v1/user', require('./user'));
router.use('/api/v1/vendor', require('./vendor'));
router.use('/api/v1/order', require('./order'));
router.use('/api/v1/milk', require('./milk'));
router.use('/api/v1/society', require('./society'));

router.all('*', (req, res, next) => {

    /*
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`
    });
    */
   
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
  
    next(err);
});

module.exports = router;