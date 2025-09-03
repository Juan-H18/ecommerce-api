const express = require('express');
const router = express.Router();
router.use('/auth', require('./auth.routes'));
router.use('/productos', require('./producto.routes'));
router.use('/carro', require('./carro.routes'));
router.use('/orden', require('./ordenes.routes'));
module.exports = router;
