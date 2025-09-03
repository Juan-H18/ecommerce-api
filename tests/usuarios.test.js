const request = require("supertest");
const app = require("../src/app");
const { sequelize, Usuario } = require("../src/models");

describe("Usuarios API", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("Debe registrar un usuario nuevo", async () => {
        const res = await request(app)
        .post("/api/auth/register")
        .send({
            Nombre: "Juan",
            Correo: "juan@test.com",
            Password: "123456",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body.usuario.Correo).toBe("juan@test.com");
    });

    test("Debe impedir registrar un correo duplicado", async () => {
        const res = await request(app)
        .post("/api/auth/register")
        .send({
            Nombre: "Juan",
            Correo: "juan@test.com",
            Password: "123456",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Email ya registrado");
    });

    test("Debe loguear al usuario con credenciales correctas", async () => {
        const res = await request(app)
        .post("/api/auth/login")
        .send({
            Correo: "juan@test.com",
            Password: "123456",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.usuario.Correo).toBe("juan@test.com");
    });

    test("Debe rechazar login con credenciales incorrectas", async () => {
        const res = await request(app)
        .post("/api/auth/login")
        .send({
            Correo: "juan@test.com",
            Password: "wrongpass",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Credenciales inválidas");
    });

    test("Debe devolver datos de usuario autenticado en /me", async () => {
        // login para obtener token
        const login = await request(app)
        .post("/api/auth/login")
        .send({
            Correo: "juan@test.com",
            Password: "123456",
        });

        const token = login.body.token;

        const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.usuario.Correo).toBe("juan@test.com");
    });

    test("Debe rechazar /me sin token", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Token no proporcionado");
    });
});
