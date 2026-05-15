function obtenerUsuario() {
    return JSON.parse(localStorage.getItem("usuario"));
}

function validarSesion() {
    const usuario = obtenerUsuario();

    if (!usuario) {
        window.location.href = "index.html";
    }
}

function validarAdmin() {
    const usuario = obtenerUsuario();

    if (!usuario) {
        window.location.href = "index.html";
        return;
    }

    if (usuario.id_rol != 1) {
        alert("No tiene permisos para acceder a esta sección.");
        window.location.href = "recursos.html";
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}