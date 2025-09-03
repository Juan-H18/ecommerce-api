const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    ObtenerCarro,
    AgregarOActualizar,
    Eliminar
} = require('../controllers/carro.controller');

router.use(auth);
router.get('/', ObtenerCarro);
router.post('/', AgregarOActualizar);
router.delete('/:Id_Producto', Eliminar);

module.exports = router;
