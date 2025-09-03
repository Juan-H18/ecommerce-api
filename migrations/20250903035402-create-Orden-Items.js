'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orden_Items', {
      Id_Orden_Item: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Precio_Unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Id_Orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ordenes',
          key: 'Id_Orden'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Id_Producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Productos',
          key: 'Id_Producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orden_Items');
  }
};
