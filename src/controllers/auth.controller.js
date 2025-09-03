const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Register = async (req, res) => {
    const { Nombre, Correo, Password } = req.body;
    try {
        const existing = await Usuario.findOne({ where: { Correo }});
        if (existing) return res.status(400).json({ message: 'Email ya registrado' });
        const hash = await bcrypt.hash(Password, 10);
        const usuario = await Usuario.create({ Nombre, Correo, Password: hash });
        const token = jwt.sign({ Id_Usuario: usuario.Id_Usuario }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(201).json({ token, usuario: { Id_Usuario: usuario.Id_Usuario, Nombre: usuario.Nombre, Correo: usuario.Correo }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.Login = async (req, res) => {
    const { Correo, Password } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { Correo }});
        if (!usuario || !(await bcrypt.compare(Password, usuario.Password))) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ Id_Usuario: usuario.Id_Usuario }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token, usuario: { Id_Usuario: usuario.Id_Usuario, Nombre: usuario.Nombre, Correo: usuario.Correo }});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};
