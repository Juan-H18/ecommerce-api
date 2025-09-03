const express = require('express');
const router = express.Router();
const { 
    listarProductos,
    ObtenerProductoPorId,
    CrearProducto,
    ActualizarProducto,
    EliminarProducto
} = require('../controllers/producto.controller');
const auth = require('../middlewares/authMiddleware');


router.get('/', auth, listarProductos);
router.get('/:Id_Producto', auth, ObtenerProductoPorId);
router.post('/', auth, CrearProducto);
router.put('/:Id_Producto', auth, ActualizarProducto);
router.delete('/:Id_Producto', auth, EliminarProducto);

module.exports = router;
