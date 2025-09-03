const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Orden', {
        Id_Orden: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        Estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'created' }
    }, {
        tableName: 'Ordenes',
        timestamps: true
    });
};
