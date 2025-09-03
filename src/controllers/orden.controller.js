const { CarroItem, Producto, Orden, OrdenItem, sequelize } = require('../models');

exports.CrearOrden = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const carroItems = await CarroItem.findAll({ where: { Id_Usuario: req.user.id }, include: [Producto], transaction: t });
        if (!carroItems.length) {
        await t.rollback();
        return res.status(400).json({ message: 'Carrito vacío' });
        }

        let total = 0;
        for (const p of carroItems) {
        if (p.Cantidad > p.Producto.Stock) {
            await t.rollback();
            return res.status(400).json({ message: `Stock insufipente para ${p.Producto.Nombre}` });
        }
        total += parseFloat(p.Producto.Precio) * p.Cantidad;
        }

        const orden = await Orden.create({ Id_Usuario: req.user.id, total }, { transaction: t });

        for (const p of carroItems) {
        await OrdenItem.create({
            Id_Orden: orden.Id_Orden,
            Id_Producto: p.Id_Producto,
            Cantidad: p.Cantidad,
            Precio_Unitario: p.Producto.Precio
        }, { transaction: t });

        p.Producto.Stock -= p.Cantidad;
        await p.Producto.save({ transaction: t });
        }

        await CarroItem.destroy({ where: { Id_Usuario: req.user.id }, transaction: t });

        await t.commit();
        res.status(201).json({ Id_Orden: orden.Id_Orden });
    } catch (err) {
        console.error(err);
        await t.rollback();
        res.status(500).json({ message: 'Error procesando orden' });
    }
};

exports.ObtenerOrdenes = async (req, res) => {
    const ordens = await Orden.findAll({
        where: { Id_Usuario: req.user.id },
        include: [{ model: OrdenItem, include: [Producto] }],
        orden: [['createdAt', 'DESC']]
    });
    res.json(ordens);
};
