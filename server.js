const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'Admin123!',
    database: process.env.MYSQLDATABASE || 'gestion_recursos_audiovisuales',
    port: process.env.MYSQLPORT || 3306
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
        SELECT 
            id_usuario,
            nombre,
            correo,
            contrasena,
            id_rol
        FROM usuarios
        WHERE correo = ?
        AND contrasena = ?
    `;

    db.query(sql, [correo, contrasena], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({
                mensaje: 'Error al conectar con el servidor'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión correcto',
            usuario: results[0]
        });
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
        const inicio = new Date(fecha_inicio);
const fin = new Date(fecha_fin);

if (fin < inicio) {
    return res.status(400).json({
        error: 'La fecha de término no puede ser anterior a la fecha de inicio.'
    });
}

const diferenciaMs = fin - inicio;
const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

if (diferenciaDias > 3) {
    return res.status(400).json({
        error: 'El préstamo no puede superar un máximo de 3 días.'
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
// ASISTENTE INTELIGENTE
app.post('/bot', (req, res) => {
    const { pregunta } = req.body;
    const texto = pregunta.toLowerCase();

    // 1. Recomendación inteligente
    if (
        texto.includes('recomiendas') ||
        texto.includes('recomendar') ||
        texto.includes('recomendacion') ||
        texto.includes('recomendación') ||
        texto.includes('mejor recurso') ||
        texto.includes('sugerir') ||
        texto.includes('sugieres')
    ) {
        const sql = `
            SELECT 
                r.nombre,
                r.descripcion,
                c.nombre AS categoria,
                e.nombre AS estado,
                COUNT(sp.id_recurso) AS veces_solicitado
            FROM recursos_audiovisuales r
            INNER JOIN categorias_recurso c 
                ON r.id_categoria = c.id_categoria
            INNER JOIN estados_recurso e 
                ON r.id_estado = e.id_estado
            LEFT JOIN solicitudes_prestamo sp 
                ON r.id_recurso = sp.id_recurso
            WHERE e.nombre = 'Disponible'
            GROUP BY r.id_recurso, r.nombre, r.descripcion, c.nombre, e.nombre
            ORDER BY veces_solicitado DESC, r.nombre ASC
            LIMIT 1
        `;

        db.query(sql, (err, results) => {
            if (err || results.length === 0) {
                return res.json({
                    respuesta: 'No pude generar una recomendación en este momento. Revisa si existen recursos disponibles registrados.'
                });
            }

            const recurso = results[0];

            return res.json({
                respuesta:
                    `Te recomiendo solicitar "${recurso.nombre}".\n\n` +
                    `Motivo: pertenece a la categoría ${recurso.categoria}, se encuentra disponible y registra ${recurso.veces_solicitado} solicitudes previas en el sistema.\n\n` +
                    `Descripción: ${recurso.descripcion}`
            });
        });

    // 2. Recursos disponibles
    } else if (
        texto.includes('disponible') ||
        texto.includes('disponibles') ||
        texto.includes('que recursos hay') ||
        texto.includes('qué recursos hay') ||
        texto.includes('recursos disponibles')
    ) {
        const sql = `
            SELECT 
                r.nombre,
                r.descripcion,
                c.nombre AS categoria
            FROM recursos_audiovisuales r
            INNER JOIN estados_recurso e 
                ON r.id_estado = e.id_estado
            INNER JOIN categorias_recurso c
                ON r.id_categoria = c.id_categoria
            WHERE e.nombre = 'Disponible'
            ORDER BY c.nombre, r.nombre
        `;

        db.query(sql, (err, results) => {
            if (err) {
                return res.json({
                    respuesta: 'No pude consultar los recursos disponibles en este momento.'
                });
            }

            if (results.length === 0) {
                return res.json({
                    respuesta: 'Actualmente no hay recursos disponibles para préstamo.'
                });
            }

            const lista = results
                .map(r => `• ${r.nombre} (${r.categoria}): ${r.descripcion}`)
                .join('\n');

            return res.json({
                respuesta: `Actualmente estos recursos se encuentran disponibles:\n${lista}`
            });
        });

    // 3. Recursos de audio
    } else if (
        texto.includes('audio') ||
        texto.includes('microfono') ||
        texto.includes('micrófono') ||
        texto.includes('parlante')
    ) {
        const sql = `
            SELECT 
                r.nombre,
                r.descripcion,
                e.nombre AS estado
            FROM recursos_audiovisuales r
            INNER JOIN categorias_recurso c 
                ON r.id_categoria = c.id_categoria
            INNER JOIN estados_recurso e 
                ON r.id_estado = e.id_estado
            WHERE c.nombre LIKE '%Audio%'
            ORDER BY r.nombre
        `;

        db.query(sql, (err, results) => {
            if (err) {
                return res.json({
                    respuesta: 'No pude consultar los recursos de audio.'
                });
            }

            if (results.length === 0) {
                return res.json({
                    respuesta: 'No hay recursos de audio registrados actualmente.'
                });
            }

            const lista = results
                .map(r => `• ${r.nombre}: ${r.descripcion}. Estado: ${r.estado}`)
                .join('\n');

            return res.json({
                respuesta: `Estos son los recursos de audio registrados:\n${lista}`
            });
        });

    // 4. Regla de préstamo máximo
    } else if (
        texto.includes('3 dias') ||
        texto.includes('3 días') ||
        texto.includes('maximo') ||
        texto.includes('máximo') ||
        texto.includes('cuantos dias') ||
        texto.includes('cuántos días')
    ) {
        return res.json({
            respuesta:
                'El sistema permite solicitar un recurso por un máximo de 3 días. ' +
                'Además, la fecha de término no puede ser anterior a la fecha de inicio.'
        });

    // 5. Consulta por clase, reunión o presentación
    } else if (
        texto.includes('clase') ||
        texto.includes('presentacion') ||
        texto.includes('presentación') ||
        texto.includes('reunion') ||
        texto.includes('reunión')
    ) {
        const sql = `
            SELECT 
                r.nombre,
                r.descripcion,
                c.nombre AS categoria
            FROM recursos_audiovisuales r
            INNER JOIN categorias_recurso c 
                ON r.id_categoria = c.id_categoria
            INNER JOIN estados_recurso e 
                ON r.id_estado = e.id_estado
            WHERE e.nombre = 'Disponible'
            AND (
                c.nombre LIKE '%Proyección%'
                OR c.nombre LIKE '%Computación%'
                OR r.nombre LIKE '%Proyector%'
                OR r.nombre LIKE '%Notebook%'
                OR r.nombre LIKE '%Televisor%'
            )
            ORDER BY r.nombre
            LIMIT 3
        `;

        db.query(sql, (err, results) => {
            if (err || results.length === 0) {
                return res.json({
                    respuesta: 'No encontré recursos disponibles específicos para una clase o presentación.'
                });
            }

            const lista = results
                .map(r => `• ${r.nombre} (${r.categoria}): ${r.descripcion}`)
                .join('\n');

            return res.json({
                respuesta:
                    `Para una clase, reunión o presentación, te sugiero revisar estos recursos disponibles:\n${lista}`
            });
        });

    // 6. Respuesta general
    } else {
        return res.json({
            respuesta:
                'Soy el asistente inteligente de recursos audiovisuales. Puedo ayudarte a consultar disponibilidad, sugerir recursos para clases o presentaciones, revisar recursos de audio y explicar las reglas de préstamo.'
        });
    }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});