require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function start() {
try {
    await sequelize.authenticate();
    console.log('Conectado a la BD');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Servidor Corriendo en localhost:${PORT}`));
} catch (err) {
    console.error('Error inicia app', err);
    process.exit(1);
}
}

start();
