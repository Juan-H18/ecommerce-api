const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
        Id_Usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Nombre: { type: DataTypes.STRING, allowNull: false },
        Correo: { type: DataTypes.STRING, allowNull: false, unique: true },
        Password: { type: DataTypes.STRING, allowNull: false },
    }, {
        tableName: 'Usuarios',
        timestamps: true
    });
};
