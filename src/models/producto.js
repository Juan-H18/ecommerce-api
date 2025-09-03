const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Producto', {
        Id_Producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Nombre: { type: DataTypes.STRING, allowNull: false },
        Descripcion: { type: DataTypes.TEXT },
        Precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        Stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        Imagen_URL: { type: DataTypes.STRING, allowNull: true }
    }, {
        tableName: 'Productos',
        timestamps: true
    });
};
