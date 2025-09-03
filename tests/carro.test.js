const request = require("supertest");
const app = require("../src/app");
const { sequelize, Producto, Usuario, CarroItem } = require("../src/models");
const bcrypt = require("bcryptjs");

describe("Carrito API", () => {
    let token;
    let productoId;
    let usuarioId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        const hash = await bcrypt.hash("123456", 10);
        const usuario = await Usuario.create({
            Nombre: "Tester",
            Correo: "tester@test.com",
            Password: hash,
        });
        usuarioId = usuario.Id_Usuario;

        const producto = await Producto.create({
            Nombre: "Camiseta",
            Descripcion: "Camiseta de algodón",
            Precio: 29.99,
            Stock: 10,
        });
        productoId = producto.Id_Producto;

        const login = await request(app)
            .post("/api/auth/login")
            .send({ Correo: "tester@test.com", Password: "123456" });

        token = login.body.token;
    });

    afterAll(async () => {
    });

    test("Debe agregar un producto al carrito", async () => {
        const res = await request(app)
            .post("/api/carro")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Id_Producto: productoId,
                Cantidad: 2
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("Id_Carro_Item");
        expect(res.body.Id_Usuario).toBe(usuarioId);
        expect(res.body.Id_Producto).toBe(productoId);
        expect(res.body.Cantidad).toBe(2);
    });

    test("Debe actualizar la cantidad de un producto existente en el carrito", async () => {
        const res = await request(app)
            .post("/api/carro")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Id_Producto: productoId,
                Cantidad: 5
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.Cantidad).toBe(5);
    });

    test("Debe obtener el carrito del usuario", async () => {
        const res = await request(app)
            .get("/api/carro")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("Id_Producto", productoId);
        expect(res.body[0]).toHaveProperty("Cantidad", 5);
    });

    test("Debe eliminar un producto del carrito", async () => {
        const res = await request(app)
            .delete(`/api/carro/${productoId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Produto eliminado del carrito");
    });

    test("Debe devolver carrito vacío después de eliminar", async () => {
        const res = await request(app)
            .get("/api/carro")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    test("Debe rechazar agregar producto sin autenticación", async () => {
        const res = await request(app)
            .post("/api/carro")
            .send({
                Id_Producto: productoId,
                Cantidad: 1
            });

        expect(res.statusCode).toBe(401);
    });

    test("Debe rechazar obtener carrito sin autenticación", async () => {
        const res = await request(app)
            .get("/api/carro");

        expect(res.statusCode).toBe(401);
    });
});
