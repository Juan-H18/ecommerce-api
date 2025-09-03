const { CarroItem, Producto } = require('../models');

exports.ObtenerCarro = async (req, res) => {
    const items = await CarroItem.findAll({
        where: { Id_Usuario: req.user.Id_Usuario },
        include: [{ model: Producto }]
    });
    res.json(items);
};

exports.AgregarOActualizar = async (req, res) => {
    const { Id_Producto, Cantidad } = req.body;

    const producto = await Producto.findByPk(Id_Producto);
    if (!producto) return res.status(404).json({ message: 'El producto no existe' });

    if (Cantidad > producto.Stock) {
        return res.status(400).json({ message: `Cantidad solicitada excede el stock disponible (${producto.Stock})` });
    }

    let item = await CarroItem.findOne({ where: { Id_Usuario: req.user.Id_Usuario, Id_Producto }});
    if (item) {
        item.Cantidad = Cantidad;
        await item.save();
    } else {
        item = await CarroItem.create({ Id_Usuario: req.user.Id_Usuario, Id_Producto, Cantidad });
    }

    res.json(item);
};


exports.Eliminar = async (req, res) => {
    const Id_Producto = req.params.Id_Producto;
    await CarroItem.destroy({ where: { Id_Usuario: req.user.Id_Usuario, Id_Producto }});
    res.json({ message: 'Produto eliminado del carrito' });
};
