const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    CrearOrden,
    ObtenerOrdenes
} = require('../controllers/orden.controller');

router.use(auth);
router.post('/', CrearOrden);
router.get('/', ObtenerOrdenes);

module.exports = router;
