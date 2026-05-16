const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error('Error MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// LOGIN
app.post('/login', (req, res) => {

    const { correo, contrasena } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        AND contrasena = ?
    `;

    db.query(sql, [correo, contrasena], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                mensaje: 'Error servidor'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        res.json({
            mensaje: 'Login correcto',
            usuario: results[0]
        });
    });
});

// OBTENER RECURSOS
app.get('/recursos', (req, res) => {

    const sql = `
        SELECT *
        FROM recursos_audiovisuales
        ORDER BY id_recurso ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Error al obtener recursos'
            });
        }

        res.json(results);
    });
});

// CREAR RECURSO
app.post('/recursos', (req, res) => {

    const {
        nombre,
        descripcion,
        id_categoria,
        id_estado
    } = req.body;

    const sql = `
        INSERT INTO recursos_audiovisuales
        (
            nombre,
            descripcion,
            id_categoria,
            id_estado
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            descripcion,
            id_categoria,
            id_estado
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Error al crear recurso'
                });
            }

            res.json({
                mensaje: 'Recurso creado correctamente'
            });
        }
    );
});

// REGISTRO
app.post('/registro', (req, res) => {

    const {
        nombre,
        correo,
        contrasena
    } = req.body;

    const sql = `
        INSERT INTO usuarios
        (
            nombre,
            correo,
            contrasena,
            id_rol
        )
        VALUES (?, ?, ?, 1)
    `;

    db.query(
        sql,
        [
            nombre,
            correo,
            contrasena
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Error al registrar usuario'
                });
            }

            res.json({
                mensaje: 'Usuario registrado correctamente'
            });
        }
    );
});

// CREAR SOLICITUD
app.post('/solicitudes', (req, res) => {

    const {
        id_usuario,
        id_recurso,
        fecha_inicio,
        fecha_fin
    } = req.body;

    const sql = `
        INSERT INTO solicitudes_prestamo
        (
            fecha_inicio,
            fecha_fin,
            id_usuario,
            id_estado_solicitud,
            id_recurso
        )
        VALUES (?, ?, ?, 1, ?)
    `;

    db.query(
        sql,
        [
            fecha_inicio,
            fecha_fin,
            id_usuario,
            id_recurso
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Error al crear solicitud'
                });
            }

            res.json({
                mensaje: 'Solicitud creada correctamente'
            });
        }
    );
});

// HISTORIAL
app.get('/solicitudes', (req, res) => {

    const sql = `
        SELECT *
        FROM solicitudes_prestamo
        ORDER BY id_solicitud DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Error al obtener solicitudes'
            });
        }

        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});