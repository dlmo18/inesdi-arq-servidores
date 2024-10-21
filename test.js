const request = require('supertest');
const app = require('./app');

describe("GET /api/", () => {
    it("Debe retornar el total de registros", async () => {
        return request(app)
            .get("/api")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data.employees).toBe(7);                
            })
    });
});

describe("GET /api/employees", () => {
    it("Debe retornar todos los registros", async () => {
        return request(app)
            .get("/api/employees")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(7);
            })
    });

    it("Debe retornar la página 2 = 2 registros", async () => {
        return request(app)
            .get("/api/employees?page=2")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(2);
            })
    });

    it("Debe retornar la página 4 = 1 registro", async () => {
        return request(app)
            .get("/api/employees?page=4")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(1);
            })
    });

    it("Debe retornar solo los USERS = 5 registros", async () => {
        return request(app)
            .get("/api/employees?user=true")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(5);
            })
    });

    it("Debe retornar solo los Badges Green = 1 registro", async () => {
        return request(app)
            .get("/api/employees?badges=green")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(1);
            })
    });

    it("Debe retornar solo a 'David' = 1 registro", async () => {
        return request(app)
            .get("/api/employees/David")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(1);
            })
    });

    it("Debe retornar '{\"code\": \"bad_request\"}' si nombre no existe", async () => {
        return request(app)
            .get("/api/employees/NO EXISTE")
            .expect('Content-Type', /json/)
            .expect(404)
    });
});


describe("POST /api/employees", () => {
    it("Debe registrar a un nuevo usuario", async () => {

        const newReg = {
            "name": "Leandro",
            "age": 42,
            "phone": {
                "personal": "555-123-123",
                "work": "555-456-456",
                "ext": "7673"
            },
            "privileges": "user",
            "favorites": {
                "artist": "Miro",
                "food": "meringue"
            },
            "finished": [
                11,
                25
            ],
            "badges": [
                "green"
            ],
            "points": [
                {
                    "points": 85,
                    "bonus": 20
                },
                {
                    "points": 64,
                    "bonus": 12
                }
            ]
        };

        return request(app)
            .post("/api/employees")
            .send(newReg)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data.total).toBe(8);
                expect(res._body.data.newID).toBe(7);
            })
    });

    it("Debe retornar solo al nuevo usuario 'Leandro' = 1 registro", async () => {
        return request(app)
            .get("/api/employees/Leandro")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res._body.status).toBe(true);
                expect(res._body.data).toHaveLength(1);
            })
    });

    it("NO debe registrar usuario sin nombre", async () => {

        const newReg = {
            "age": 42
        };

        return request(app)
            .post("/api/employees")
            .send(newReg)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res._body.code).toBe("bad_request");
                expect(res._body.message).toBe("Nombre inválido");
            })
    });

    it("NO debe registrar usuario con edad no válida", async () => {

        const newReg = {
            "name": "Ana",
            "age": "ABC"
        };

        return request(app)
            .post("/api/employees")
            .send(newReg)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res._body.code).toBe("bad_request");
                expect(res._body.message).toBe("Edad inválida");
            })
    });

    it("NO debe registrar usuario sin teléfonos", async () => {

        const newReg = {
            "name": "Ana",
            "age": 23,
            "privileges": "invite",
        };

        return request(app)
            .post("/api/employees")
            .send(newReg)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res._body.code).toBe("bad_request");
                expect(res._body.message).toBe("Teléfonos requeridos");
            })
    });

    it("NO debe registrar usuario con privilegios inválidos", async () => {

        const newReg = {
            "name": "Ana",
            "age": 23,
            "phone": {
                "personal": "555-123-123",
                "work": "555-456-456",
                "ext": "7673"
            },
            "privileges": "invite",
        };

        return request(app)
            .post("/api/employees")
            .send(newReg)
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
                expect(res._body.code).toBe("bad_request");
                expect(res._body.message).toBe("Privilegios son requeridos (admin o user)");
            })
    });
});


