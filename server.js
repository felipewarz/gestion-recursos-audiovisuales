const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin123!',
    database: 'gestion_recursos_audiovisuales'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }

    console.log('Conectado a MySQL');
});

app.get('/', (req, res) => {
  const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
});

app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ? AND contrasena = ?
    `;

    db.query(sql, [correo, contrasena], (err, resultados) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (resultados.length > 0) {
            res.json({
                mensaje: 'Login exitoso',
                usuario: resultados[0]
            });
        } else {
            res.json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }
    });
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

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error('Error al obtener recursos:', err);
            return res.status(500).json({ error: 'Error al obtener recursos' });
        }

        res.json(resultados);
    });
});

app.post('/recurso', (req, res) => {
    const { nombre, descripcion, id_categoria } = req.body;

    const sql = `
        INSERT INTO recursos_audiovisuales
        (nombre, descripcion, id_categoria, id_estado)
        VALUES (?, ?, ?, 1)
    `;

    db.query(sql, [nombre, descripcion, id_categoria], (err) => {
        if (err) {
            console.error('Error al crear recurso:', err);
            return res.status(500).json({ error: 'Error al crear recurso' });
        }

        res.json({ mensaje: 'Recurso creado correctamente' });
    });
});

app.put('/recurso/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, id_categoria } = req.body;

    const sql = `
        UPDATE recursos_audiovisuales
        SET nombre = ?, descripcion = ?, id_categoria = ?
        WHERE id_recurso = ?
    `;

    db.query(sql, [nombre, descripcion, id_categoria, id], (err) => {
        if (err) {
            console.error('Error al editar recurso:', err);
            return res.status(500).json({ error: 'Error al editar recurso' });
        }

        res.json({ mensaje: 'Recurso actualizado correctamente' });
    });
});

app.delete('/recurso/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        DELETE FROM recursos_audiovisuales
        WHERE id_recurso = ?
    `;

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error al eliminar recurso:', err);
            return res.status(500).json({ error: 'Error al eliminar recurso' });
        }

        res.json({ mensaje: 'Recurso eliminado correctamente' });
    });
});

// DEVOLVER RECURSO DESDE SOLICITUD
app.put('/solicitud/:id/devolver', (req, res) => {

    const idSolicitud = req.params.id;

    const sqlBuscar = `
        SELECT id_recurso
        FROM solicitudes_prestamo
        WHERE id_solicitud = ?
    `;

    db.query(sqlBuscar, [idSolicitud], (err, solicitudes) => {

        if (err) {

            console.error('Error al buscar solicitud:', err);

            return res.status(500).json({
                error: 'Error al buscar solicitud'
            });
        }

        if (solicitudes.length === 0) {

            return res.status(404).json({
                error: 'Solicitud no encontrada'
            });
        }

        const idRecurso = solicitudes[0].id_recurso;

        // CAMBIAR ESTADO DE SOLICITUD
        const sqlSolicitud = `
            UPDATE solicitudes_prestamo
            SET id_estado_solicitud = 4
            WHERE id_solicitud = ?
        `;

        db.query(sqlSolicitud, [idSolicitud], (err) => {

            if (err) {

                console.error('Error al actualizar solicitud:', err);

                return res.status(500).json({
                    error: 'Error al actualizar solicitud'
                });
            }

            // LIBERAR RECURSO
            const sqlRecurso = `
                UPDATE recursos_audiovisuales
                SET id_estado = 1
                WHERE id_recurso = ?
            `;

            db.query(sqlRecurso, [idRecurso], (err) => {

                if (err) {

                    console.error('Error al liberar recurso:', err);

                    return res.status(500).json({
                        error: 'Error al liberar recurso'
                    });
                }

                res.json({
                    mensaje: 'Recurso devuelto correctamente'
                });
            });
        });
    });
});

// CREAR SOLICITUD PENDIENTE
app.post('/solicitud', (req, res) => {
    const { id_usuario, id_recurso, fecha_inicio, fecha_fin } = req.body;

    if (!id_usuario || !id_recurso || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
            error: 'Debe completar todos los campos'
        });
    }

    const sqlVerificar = `
        SELECT id_estado
        FROM recursos_audiovisuales
        WHERE id_recurso = ?
    `;

    db.query(sqlVerificar, [id_recurso], (err, recursos) => {
        if (err) {
            console.error('Error al verificar recurso:', err);
            return res.status(500).json({ error: 'Error al verificar recurso' });
        }

        if (recursos.length === 0) {
            return res.status(404).json({ error: 'El recurso no existe' });
        }

        if (recursos[0].id_estado != 1) {
            return res.status(400).json({
                error: 'El recurso no se encuentra disponible'
            });
        }

        const sqlSolicitud = `
            INSERT INTO solicitudes_prestamo
            (id_usuario, id_recurso, fecha_inicio, fecha_fin, id_estado_solicitud)
            VALUES (?, ?, ?, ?, 1)
        `;

        db.query(
            sqlSolicitud,
            [id_usuario, id_recurso, fecha_inicio, fecha_fin],
            (err, resultado) => {
                if (err) {
                    console.error('Error al crear solicitud:', err);
                    return res.status(500).json({ error: 'Error al crear solicitud' });
                }

                res.json({
                    mensaje: 'Solicitud registrada correctamente. Queda pendiente de aprobación.',
                    id_solicitud: resultado.insertId
                });
            }
        );
    });
});

// HISTORIAL DE SOLICITUDES
app.get('/solicitudes', (req, res) => {
    const sql = `
        SELECT 
            sp.id_solicitud,
            sp.id_usuario,
            u.nombre AS nombre_usuario,
            sp.id_recurso,
            r.nombre AS nombre_recurso,
            sp.fecha_inicio,
            sp.fecha_fin,
            sp.id_estado_solicitud
        FROM solicitudes_prestamo sp
        LEFT JOIN usuarios u ON u.id_usuario = sp.id_usuario
        LEFT JOIN recursos_audiovisuales r ON r.id_recurso = sp.id_recurso
        ORDER BY sp.id_solicitud DESC
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error('Error al obtener solicitudes:', err);
            return res.status(500).json({ error: 'Error al obtener solicitudes' });
        }

        res.json(resultados);
    });
});

// APROBAR SOLICITUD
app.put('/solicitud/:id/aprobar', (req, res) => {
    const idSolicitud = req.params.id;

    const sqlBuscar = `
        SELECT id_recurso
        FROM solicitudes_prestamo
        WHERE id_solicitud = ?
    `;

    db.query(sqlBuscar, [idSolicitud], (err, solicitudes) => {
        if (err) {
            console.error('Error al buscar solicitud:', err);
            return res.status(500).json({ error: 'Error al buscar solicitud' });
        }

        if (solicitudes.length === 0) {
            return res.status(404).json({ error: 'La solicitud no existe' });
        }

        const idRecurso = solicitudes[0].id_recurso;

        const sqlVerificarRecurso = `
            SELECT id_estado
            FROM recursos_audiovisuales
            WHERE id_recurso = ?
        `;

        db.query(sqlVerificarRecurso, [idRecurso], (err, recursos) => {
            if (err) {
                console.error('Error al verificar recurso:', err);
                return res.status(500).json({ error: 'Error al verificar recurso' });
            }

            if (recursos.length === 0) {
                return res.status(404).json({ error: 'El recurso asociado no existe' });
            }

            if (recursos[0].id_estado != 1) {
                return res.status(400).json({
                    error: 'No se puede aprobar. El recurso no está disponible.'
                });
            }

            const sqlAprobar = `
                UPDATE solicitudes_prestamo
                SET id_estado_solicitud = 2
                WHERE id_solicitud = ?
            `;

            db.query(sqlAprobar, [idSolicitud], (err) => {
                if (err) {
                    console.error('Error al aprobar solicitud:', err);
                    return res.status(500).json({ error: 'Error al aprobar solicitud' });
                }

                const sqlActualizarRecurso = `
                    UPDATE recursos_audiovisuales
                    SET id_estado = 2
                    WHERE id_recurso = ?
                `;

                db.query(sqlActualizarRecurso, [idRecurso], (err) => {
                    if (err) {
                        console.error('Error al actualizar recurso:', err);
                        return res.status(500).json({
                            error: 'Solicitud aprobada, pero no se pudo actualizar el recurso'
                        });
                    }

                    res.json({
                        mensaje: 'Solicitud aprobada correctamente. El recurso quedó no disponible.'
                    });
                });
            });
        });
    });
});

// RECHAZAR SOLICITUD
app.put('/solicitud/:id/rechazar', (req, res) => {
    const idSolicitud = req.params.id;

    const sql = `
        UPDATE solicitudes_prestamo
        SET id_estado_solicitud = 3
        WHERE id_solicitud = ?
    `;

    db.query(sql, [idSolicitud], (err) => {
        if (err) {
            console.error('Error al rechazar solicitud:', err);
            return res.status(500).json({ error: 'Error al rechazar solicitud' });
        }

        res.json({
            mensaje: 'Solicitud rechazada correctamente.'
        });
    });
});

app.get('/dashboard', (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM recursos_audiovisuales) AS total_recursos,
            (SELECT COUNT(*) FROM recursos_audiovisuales WHERE id_estado = 1) AS recursos_disponibles,
            (SELECT COUNT(*) FROM recursos_audiovisuales WHERE id_estado <> 1) AS recursos_no_disponibles,
            (SELECT COUNT(*) FROM solicitudes_prestamo) AS total_solicitudes,
            (SELECT COUNT(*) FROM solicitudes_prestamo WHERE id_estado_solicitud = 1) AS solicitudes_pendientes
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error('Error al obtener dashboard:', err);
            return res.status(500).json({ error: 'Error al obtener dashboard' });
        }

        res.json(resultados[0]);
    });
});
// REGISTRO DE USUARIOS
app.post('/registro', (req, res) => {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({
            error: 'Debe completar todos los campos'
        });
    }

    const sqlVerificar = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
    `;

    db.query(sqlVerificar, [correo], (err, resultados) => {
        if (err) {
            console.error('Error al verificar correo:', err);
            return res.status(500).json({
                error: 'Error al verificar usuario'
            });
        }

        if (resultados.length > 0) {
            return res.status(400).json({
                error: 'El correo ya se encuentra registrado'
            });
        }

        const sqlInsertar = `
            INSERT INTO usuarios
            (nombre, correo, contrasena, id_rol)
            VALUES (?, ?, ?, 2)
        `;

        db.query(sqlInsertar, [nombre, correo, contrasena], (err) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({
                    error: 'Error al registrar usuario'
                });
            }

            res.json({
                mensaje: 'Usuario registrado correctamente'
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});