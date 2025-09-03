const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario } = require('../models');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'No se proporciono el token' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Usuario.findByPk(payload.Id_Usuario);

        if (!user) return res.status(401).json({ message: 'Este Usuario no existe' });

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = authMiddleware;
