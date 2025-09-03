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
const upload = require('../middlewares/upload');


router.get('/', auth, listarProductos);
router.get('/:Id_Producto', auth, ObtenerProductoPorId);
router.post('/', auth, upload.single("Imagen"), CrearProducto);
router.put('/:Id_Producto', auth, upload.single("Imagen"), ActualizarProducto);
router.delete('/:Id_Producto', auth, EliminarProducto);

module.exports = router;
