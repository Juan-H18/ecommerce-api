const { Producto } = require('../models');

exports.listarProductos = async (req, res) => {
    const productos = await Producto.findAll();
    res.json(productos);
};

exports.ObtenerProductoPorId = async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
};

exports.CrearProducto = async (req, res) => {
    const { Nombre, Descripcion, Precio, Stock } = req.body;
    const producto = await Producto.create({ Nombre, Descripcion, Precio, Stock });
    res.status(201).json(producto);
};

exports.ActualizarProducto = async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json(producto);
};

exports.EliminarProducto = async (req, res) => {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ message: 'Eliminado' });
};
