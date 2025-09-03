const request = require("supertest");
const app = require("../src/app");
const { sequelize, Producto, Usuario } = require("../src/models");
const bcrypt = require("bcryptjs");

describe("Productos API", () => {
    let token;
    let productoId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Crear un usuario para autenticación
        const hash = await bcrypt.hash("123456", 10);
        await Usuario.create({
            Nombre: "Tester",
            Correo: "tester@test.com",
            Password: hash,
        });

        // Loguear y obtener token
        const login = await request(app)
            .post("/api/auth/login")
            .send({ Correo: "tester@test.com", Password: "123456" });

        token = login.body.token;
    });

    afterAll(async () => {
        // No cerrar la conexión, solo limpiar datos si es necesario
        // La conexión se mantiene activa para otros tests
    });

    test("Debe crear un producto nuevo", async () => {
        const res = await request(app)
            .post("/api/productos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Nombre: "Camiseta",
                Descripcion: "Camiseta de algodón",
                Precio: 29.99,
                Stock: 10,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("Id_Producto");
        expect(res.body.Nombre).toBe("Camiseta");

        productoId = res.body.Id_Producto;
    });

    test("Debe listar todos los productos", async () => {
        const res = await request(app)
            .get("/api/productos")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("Debe obtener un producto por ID", async () => {
        const res = await request(app)
            .get(`/api/productos/${productoId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("Id_Producto", productoId);
        expect(res.body.Nombre).toBe("Camiseta");
    });

    test("Debe devolver 404 al buscar un producto inexistente", async () => {
        const res = await request(app)
            .get("/api/productos/9999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Producto no encontrado");
    });

    test("Debe actualizar un producto existente", async () => {
        const res = await request(app)
            .put(`/api/productos/${productoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                Nombre: "Camiseta Actualizada",
                Descripcion: "Camiseta nueva",
                Precio: 39.99,
                Stock: 15,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.Nombre).toBe("Camiseta Actualizada");
        expect(res.body.Precio).toBe(39.99); // Sequelize puede devolver DECIMAL como número
    });

    test("Debe devolver 404 al intentar actualizar producto inexistente", async () => {
        const res = await request(app)
            .put("/api/productos/9999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Nombre: "Nada",
                Descripcion: "No existe",
                Precio: 50,
                Stock: 5,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Producto no encontrado");
    });

    test("Debe eliminar un producto existente", async () => {
        const res = await request(app)
            .delete(`/api/productos/${productoId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Eliminado");
    });

    test("Debe devolver 404 al intentar eliminar un producto inexistente", async () => {
        const res = await request(app)
            .delete("/api/productos/9999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Producto no encontrado");
    });
});