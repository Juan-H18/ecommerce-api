const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Usuario.findByPk(decoded.Id_Usuario, {
        attributes: ["Id_Usuario", "Nombre", "Correo"],
        });

        if (!usuario) return res.status(401).json({ message: "Usuario no válido" });

        req.user = usuario;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = authMiddleware;
