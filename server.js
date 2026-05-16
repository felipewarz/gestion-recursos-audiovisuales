const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

console.log('Base de datos usada:', process.env.MYSQLDATABASE);

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/recursos', (req, res) => {

    const sql = `
        SELECT 
            id_recurso,
            nombre,
            descripcion,
            id_categoria,
            id_estado
        FROM recursos_audiovisuales
        ORDER BY id_recurso ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error('Error al obtener recursos:', err);

            return res.status(500).json({
                error: 'Error al obtener recursos'
            });
        }

        res.json(results);
    });
});

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
                console.error('Error al crear solicitud:', err);

                return res.status(500).json({
                    error: 'Error al crear solicitud'
                });
            }

            res.json({
                mensaje: 'Solicitud creada correctamente',
                id: result.insertId
            });
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});