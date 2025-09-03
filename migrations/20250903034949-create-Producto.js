'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Productos', {
      Id_Producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Descripcion: {
        type: Sequelize.TEXT
      },
      Precio: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      Stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Imagen_URL: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Productos');
  }
};
