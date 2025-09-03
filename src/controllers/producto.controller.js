const { Producto } = require('../models');
const cloudinary = require("../config/cloudinary");

exports.listarProductos = async (req, res) => {
    const productos = await Producto.findAll();
    res.json(productos);
};

exports.ObtenerProductoPorId = async (req, res) => {
    const producto = await Producto.findByPk(req.params.Id_Producto);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
};

exports.CrearProducto = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, Stock } = req.body;

        let imagenUrl = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "E-Commerce",
                        format: "webp",
                        quality: "auto:best",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            imagenUrl = result.secure_url;
        }

        const producto = await Producto.create({
            Nombre,
            Descripcion,
            Precio,
            Stock,
            Imagen_URL: imagenUrl,
        });

        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear producto" });
    }
};

exports.ActualizarProducto = async (req, res) => {
    try {
        const { Id_Producto } = req.params;
        const { Nombre, Descripcion, Precio, Stock } = req.body;

        const producto = await Producto.findByPk(Id_Producto);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        let imagenUrl = producto.Imagen_URL;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "E-Commerce",
                        format: "webp",
                        quality: "auto:best",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            imagenUrl = result.secure_url;
        }

        await producto.update({
            Nombre,
            Descripcion,
            Precio,
            Stock,
            Imagen_URL: imagenUrl,
        });

        res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
};

exports.EliminarProducto = async (req, res) => {
    const producto = await Producto.findByPk(req.params.Id_Producto);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ message: 'Eliminado' });
};
