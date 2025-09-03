const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('OrdenItem', {
        Id_Orden_Item: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Cantidad: { type: DataTypes.INTEGER, allowNull: false },
        Precio_Unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false }
    }, {
        tableName: 'Orden_Items',
        timestamps: false
    });
};
