const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('CarroItem', {
        Id_Carro_Item: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Cantidad: { type: DataTypes.INTEGER, allowNull: false}
    }, {
        tableName: 'Carro_Items',
        timestamps: true
    });
};
