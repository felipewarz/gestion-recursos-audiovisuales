Sistema:
Plataforma web inteligente para la gestión y optimización de recursos audiovisuales

Tecnologías utilizadas:
- Node.js
- Express
- MySQL
- HTML5
- CSS3
- JavaScript

Descripción:
La base de datos permite administrar usuarios, recursos audiovisuales, solicitudes de préstamo, devoluciones y estados del sistema.

Relaciones principales:
- Un usuario puede realizar múltiples solicitudes.
- Un recurso puede pertenecer a una categoría.
- Una solicitud posee estados de seguimiento.
- Las devoluciones permiten liberar automáticamente recursos.

Funcionalidades principales:
- Registro de usuarios.
- Inicio de sesión.
- Solicitud de recursos.
- Aprobación y rechazo de solicitudes.
- Dashboard estadístico.
- Historial personalizado.
- Gestión automática de devoluciones.

Instrucciones de ejecución:
1. Importar el archivo crear_bd_y_datos.sql en MySQL.
2. Abrir el proyecto en Visual Studio Code.
3. Ejecutar el comando:

node server.js

4. Abrir el archivo index.html.
5. Iniciar sesión como administrador o usuario.

Credenciales de prueba:

Administrador
Correo: admin@demo.cl
Contraseña: 123456

Usuario
Correo: usuario@demo.cl
Contraseña: 123456