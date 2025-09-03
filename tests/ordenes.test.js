const request = require("supertest");
const app = require("../src/app");
const { sequelize, Producto, Usuario, CarroItem, Orden, OrdenItem } = require("../src/models");
const bcrypt = require("bcryptjs");

describe("Órdenes API", () => {
    let token;
    let productoId;
    let usuarioId;
    let carroItemId;

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

    test("Debe crear una orden nueva", async () => {
        await CarroItem.create({
            Id_Usuario: usuarioId,
            Id_Producto: productoId,
            Cantidad: 2
        });

        const res = await request(app)
            .post("/api/orden")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Direccion: "Calle Test 123",
                Ciudad: "Ciudad Test",
                CodigoPostal: "12345",
                Telefono: "1234567890"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("Id_Orden");
        expect(typeof res.body.Id_Orden).toBe("number");
    });

    test("Debe obtener las órdenes del usuario", async () => {
        const res = await request(app)
            .get("/api/orden")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("Id_Orden");
        expect(res.body[0]).toHaveProperty("OrdenItems");
    });

    test("Debe rechazar crear orden sin autenticación", async () => {
        const res = await request(app)
            .post("/api/orden")
            .send({
                Direccion: "Calle Test 123",
                Ciudad: "Ciudad Test",
                CodigoPostal: "12345",
                Telefono: "1234567890"
            });

        expect(res.statusCode).toBe(401);
    });

    test("Debe rechazar obtener órdenes sin autenticación", async () => {
        const res = await request(app)
            .get("/api/orden");

        expect(res.statusCode).toBe(401);
    });

    test("Debe crear orden con múltiples productos", async () => {
        const producto2 = await Producto.create({
            Nombre: "Pantalón",
            Descripcion: "Pantalón vaquero",
            Precio: 49.99,
            Stock: 5,
        });

        await CarroItem.bulkCreate([
            {
                Id_Usuario: usuarioId,
                Id_Producto: productoId,
                Cantidad: 1
            },
            {
                Id_Usuario: usuarioId,
                Id_Producto: producto2.Id_Producto,
                Cantidad: 2
            }
        ]);

        const res = await request(app)
            .post("/api/orden")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Direccion: "Calle Test 456",
                Ciudad: "Ciudad Test",
                CodigoPostal: "54321",
                Telefono: "0987654321"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("Id_Orden");
        expect(typeof res.body.Id_Orden).toBe("number");
    });

    test("Debe calcular el total de la orden correctamente", async () => {
        await CarroItem.create({
            Id_Usuario: usuarioId,
            Id_Producto: productoId,
            Cantidad: 3
        });

        const res = await request(app)
            .post("/api/orden")
            .set("Authorization", `Bearer ${token}`)
            .send({
                Direccion: "Calle Test 789",
                Ciudad: "Ciudad Test",
                CodigoPostal: "98765",
                Telefono: "5555555555"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("Id_Orden");
        expect(typeof res.body.Id_Orden).toBe("number");
    });
});
