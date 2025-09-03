const sequelize = require('../config/database');
const UsuarioModel = require('./usuario');
const ProductooModel = require('./Producto');
const CarroItemModel = require('./carroItem');
const OrdenModel = require('./orden');
const OrdenItemModel = require('./ordenItem');

const Usuario = UsuarioModel(sequelize);
const Producto = ProductooModel(sequelize);
const CarroItem = CarroItemModel(sequelize);
const Orden = OrdenModel(sequelize);
const OrdenItem = OrdenItemModel(sequelize);

Usuario.hasMany(CarroItem, { foreignKey: 'Id_Usuario', onDelete: 'CASCADE' });
CarroItem.belongsTo(Usuario, { foreignKey: 'Id_Usuario' });

Producto.hasMany(CarroItem, { foreignKey: 'Id_Producto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CarroItem.belongsTo(Producto, { foreignKey: 'Id_Producto' , onDelete: 'CASCADE', onUpdate: 'CASCADE' },);

Usuario.hasMany(Orden, { foreignKey: { name: 'Id_Usuario', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Orden.belongsTo(Usuario, { foreignKey: { name: 'Id_Usuario', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Orden.hasMany(OrdenItem, { foreignKey: { name: 'Id_Orden', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrdenItem.belongsTo(Orden, { foreignKey: { name: 'Id_Orden', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Producto.hasMany(OrdenItem, { foreignKey: { name: 'Id_Producto', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrdenItem.belongsTo(Producto, { foreignKey: { name: 'Id_Producto', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = { sequelize, Usuario, Producto, CarroItem, Orden, OrdenItem };
