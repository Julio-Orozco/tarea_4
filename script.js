/*==================================================
                EDUGESTOR
                script.js
==================================================*/

/*==================================================
                VARIABLES GLOBALES
==================================================*/

const paginas = document.querySelectorAll(".pagina");
const botonesMenu = document.querySelectorAll(".menu-item");

const tablaEstudiantes = document.getElementById("tablaEstudiantes");
const tablaHistorial = document.getElementById("tablaHistorial");

const modalRegistro = document.getElementById("modalRegistro");
const modalHistorial = document.getElementById("modalHistorial");

const toast = document.getElementById("toast");
const toastMensaje = document.getElementById("toastMensaje");

/*==================================================
                LOCAL STORAGE
==================================================*/

const CLAVE_STORAGE = "EduGestorEstudiantes";
const CLAVE_HISTORIAL = "EduGestorHistorial";

/*==================================================
        DATOS DE EJEMPLO - ESTUDIANTES
==================================================*/

const nombres = [

    "María González",
    "Carlos Pérez",
    "Ana Rodríguez",
    "Luis Martínez",
    "Elena Soto",
    "José Ramírez",
    "Laura Fernández",
    "Miguel Torres",
    "Patricia Gómez",
    "Ricardo Díaz",
    "Sofía Herrera",
    "Daniel Vargas",
    "Gabriela Rojas",
    "Andrés Castillo",
    "Valeria Mora"

];

function generarEstudiantes() {

    return nombres.map((nombre, index) => {

        return {

            id: index + 1,

            nombre: nombre,

            genero: index % 2 === 0 ? "Femenino" : "Masculino",

            ingreso: `2024-0${(index % 6) + 1}-0${(index % 9) + 1}`,

            nacimiento: `200${index % 6}-0${(index % 8) + 1}-15`,

            telefono: `8888-${1000 + index}`,

            nacionalidad: "Costarricense",

            identificacion: `1-1111-${1000 + index}`,

            estado: index < 12

        };

    });

}

let estudiantes = [];
let historial = [];

/*==================================================
            CARGAR LOCAL STORAGE
==================================================*/

const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
const historialGuardado = localStorage.getItem(CLAVE_HISTORIAL);

 // Al recagar la pagina no perdemos los cambios
if (datosGuardados){
    estudiantes = JSON.parse(datosGuardados);
} else {
    estudiantes = generarEstudiantes();
    guardarLocal();
}

if (historialGuardado) {

    historial = JSON.parse(historialGuardado);

} else {

    historial = [];
    guardarHistorial();

}

/*==================================================
            FUNCIONES STORAGE
==================================================*/

function guardarLocal() {

    localStorage.setItem(

        CLAVE_STORAGE,

        JSON.stringify(estudiantes)

    );

}

function guardarHistorial() {

    localStorage.setItem(

        CLAVE_HISTORIAL,

        JSON.stringify(historial)

    );

}

/*==================================================
            NAVEGACIÓN
==================================================*/

botonesMenu.forEach(boton => {

    boton.addEventListener("click", () => {

        botonesMenu.forEach(btn => btn.classList.remove("activo"));

        boton.classList.add("activo");

        const pagina = boton.dataset.seccion;

        paginas.forEach(sec => {

            sec.classList.remove("activa");

        });

        document
            .getElementById(pagina)
            .classList.add("activa");

        // Actualizar tablas al cambiar de sección
        if (pagina === "historial") {
            renderTablaHistorial();
            cargarSelectorEstudiantes();
        }

    });

});

/*==================================================
            DASHBOARD
==================================================*/

function actualizarDashboard(lista = estudiantes) {

    const total = lista.length;
    const activos = lista.filter(e => e.estado).length;
    const inactivos = total - activos;

    const exito = total === 0
        ? 0
        : Math.round((activos / total) * 100);

    document.getElementById("kpiTotal").textContent = total;
    document.getElementById("kpiActivos").textContent = activos;
    document.getElementById("kpiInactivos").textContent = inactivos;
    document.getElementById("kpiExito").textContent = exito + "%";

}

/*==================================================
            TABLA ESTUDIANTES
==================================================*/

function renderTabla() {

    tablaEstudiantes.innerHTML = "";

    estudiantes.forEach(estudiante => {

        tablaEstudiantes.innerHTML += `

        <tr>

            <td>${estudiante.id}</td>

            <td>${estudiante.nombre}</td>

            <td>${estudiante.genero}</td>

            <td>${estudiante.ingreso}</td>

            <td>${estudiante.nacimiento}</td>

            <td>${estudiante.telefono}</td>

            <td>${estudiante.nacionalidad}</td>

            <td>${estudiante.identificacion}</td>

            <td>

                <button
                    class="estado ${estudiante.estado ? "activo" : "inactivo"}"
                    onclick="cambiarEstado(${estudiante.id})">

                    ${estudiante.estado ? "Activo" : "Inactivo"}

                </button>

            </td>

            <td>

                <button
                    class="btn-principal"
                    onclick="abrirHistorial(${estudiante.id})">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==================================================
            CAMBIAR ESTADO
==================================================*/

function cambiarEstado(id) {

    const estudiante = estudiantes.find(e => e.id === id);

    estudiante.estado = !estudiante.estado;

    guardarLocal();

    renderTabla();

    actualizarDashboard();

    mostrarToast(

        estudiante.estado

            ?

            "✅ Estudiante activado correctamente"

            :

            "✅ Estudiante desactivado correctamente"

    );

}

/*==================================================
            ABRIR HISTORIAL DESDE ESTUDIANTES
==================================================*/

function abrirHistorial(id) {

    // Cambiar a la sección de historial
    botonesMenu.forEach(btn => btn.classList.remove("activo"));
    document.querySelector('[data-seccion="historial"]').classList.add("activo");

    paginas.forEach(sec => sec.classList.remove("activa"));
    document.getElementById("historial").classList.add("activa");

    // Seleccionar el estudiante en el selector
    const selector = document.getElementById("selectorEstudiante");
    selector.value = id;

    renderTablaHistorial();
    cargarSelectorEstudiantes();

    // Volver a seleccionar después de cargar
    setTimeout(() => {
        selector.value = id;
    }, 50);

}

/*==================================================
            TOAST
==================================================*/

function mostrarToast(mensaje) {

    toastMensaje.textContent = mensaje;

    toast.classList.add("mostrar");

    setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 3000);

}

/*==================================================
            INICIO
==================================================*/

actualizarDashboard();

renderTabla();

cargarSelectorEstudiantes();

renderTablaHistorial();

/*==================================================
            GRAFICOS DE BARRAS
==================================================*/

function crearBarra(nombre, valor, color, tipo, filtro) {

    return `

        <div
            class="barra"
            onclick="filtrarDashboard('${tipo}','${filtro}')">

            <span>

                ${nombre}

            </span>

            <div class="barra-progreso">

                <div
                    class="barra-relleno"
                    style="
                        width:${valor}%;
                        background:${color};
                    ">

                </div>

            </div>

            <strong>

                ${valor}

            </strong>

        </div>

    `;

}

/*==================================================
        GRAFICO NIVEL
==================================================*/

function renderGraficoNivel(lista = estudiantes) {

    const niveles = {

        Primaria: 0,

        Secundaria: 0,

        Universidad: 0

    };

    // Obtener niveles desde el historial
    historial.forEach(h => {
        if (niveles[h.nivel] !== undefined) {
            niveles[h.nivel]++;
        }
    });

    const total = historial.length || 1;

    document.getElementById("graficoNivel").innerHTML =

        crearBarra(

            "Primaria",

            Math.round((niveles.Primaria / total) * 100),

            "linear-gradient(90deg,#6C3CE1,#9D7AF2)",

            "nivel",

            "Primaria"

        )

        +

        crearBarra(

            "Secundaria",

            Math.round((niveles.Secundaria / total) * 100),

            "linear-gradient(90deg,#6C3CE1,#B59BFF)",

            "nivel",

            "Secundaria"

        )

        +

        crearBarra(

            "Universidad",

            Math.round((niveles.Universidad / total) * 100),

            "linear-gradient(90deg,#6C3CE1,#D6C8FF)",

            "nivel",

            "Universidad"

        );

}

/*==================================================
        GRAFICO RIESGO
==================================================*/

function renderGraficoRiesgo(lista = estudiantes) {

    const riesgo = {

        Bajo: 0,

        Medio: 0,

        Alto: 0

    };

    historial.forEach(h => {
        if (riesgo[h.riesgo] !== undefined) {
            riesgo[h.riesgo]++;
        }
    });

    const total = historial.length || 1;

    document.getElementById("graficoRiesgo").innerHTML =

        crearBarra(

            "Bajo",

            Math.round((riesgo.Bajo / total) * 100),

            "#27AE60",

            "riesgo",

            "Bajo"

        )

        +

        crearBarra(

            "Medio",

            Math.round((riesgo.Medio / total) * 100),

            "#F39C12",

            "riesgo",

            "Medio"

        )

        +

        crearBarra(

            "Alto",

            Math.round((riesgo.Alto / total) * 100),

            "#E74C3C",

            "riesgo",

            "Alto"

        );

}

/*==================================================
            FILTROS
==================================================*/

function filtrarDashboard(tipo, valor) {

    let filtrados = [];

    if (tipo === "nivel") {

        filtrados = historial.filter(h => h.nivel === valor);

    }

    if (tipo === "riesgo") {

        filtrados = historial.filter(h => h.riesgo === valor);

    }

    // Obtener estudiantes únicos de los filtrados
    const idsUnicos = [...new Set(filtrados.map(h => h.estudianteId))];
    const estudiantesFiltrados = estudiantes.filter(e => idsUnicos.includes(e.id));

    actualizarDashboard(estudiantesFiltrados);

    renderGraficoNivel(filtrados);

    renderGraficoRiesgo(filtrados);

}

/*==================================================
        LIMPIAR FILTROS
==================================================*/

document

    .getElementById("btnLimpiarFiltros")

    .addEventListener("click", () => {

        actualizarDashboard();

        renderGraficoNivel();

        renderGraficoRiesgo();

    });

/*==================================================
        ACTUALIZAR DASHBOARD
==================================================*/

renderGraficoNivel();

renderGraficoRiesgo();

/*==================================================
            BUSCADOR - ESTUDIANTES
==================================================*/

const inputBuscar = document.getElementById("buscarEstudiante");

inputBuscar.addEventListener("keyup", () => {

    const texto = inputBuscar.value.toLowerCase().trim();

    const filtrados = estudiantes.filter(estudiante => {

        return (

            estudiante.nombre.toLowerCase().includes(texto) ||

            estudiante.identificacion.toLowerCase().includes(texto)

        );

    });

    renderTablaFiltrada(filtrados);

});

function renderTablaFiltrada(lista) {

    tablaEstudiantes.innerHTML = "";

    lista.forEach(estudiante => {

        tablaEstudiantes.innerHTML += `

        <tr>

            <td>${estudiante.id}</td>

            <td>${estudiante.nombre}</td>

            <td>${estudiante.genero}</td>

            <td>${estudiante.ingreso}</td>

            <td>${estudiante.nacimiento}</td>

            <td>${estudiante.telefono}</td>

            <td>${estudiante.nacionalidad}</td>

            <td>${estudiante.identificacion}</td>

            <td>

                <button

                    class="estado ${estudiante.estado ? "activo" : "inactivo"}"

                    onclick="cambiarEstado(${estudiante.id})">

                    ${estudiante.estado ? "Activo" : "Inactivo"}

                </button>

            </td>

            <td>

                <button

                    class="btn-principal"

                    onclick="abrirHistorial(${estudiante.id})">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==================================================
        MODAL - REGISTRAR ESTUDIANTE
==================================================*/

const btnNuevo = document.getElementById("btnNuevo");

const cerrarModalBtn = document.getElementById("cerrarModal");

const cancelarBtn = document.getElementById("cancelar");

btnNuevo.addEventListener("click", () => {

    modalRegistro.classList.add("activo");

});

cerrarModalBtn.addEventListener("click", cerrarModalRegistro);

cancelarBtn.addEventListener("click", cerrarModalRegistro);

function cerrarModalRegistro() {

    modalRegistro.classList.remove("activo");

    document.getElementById("formEstudiante").reset();

}

/*==================================================
        REGISTRAR ESTUDIANTE
==================================================*/

const formulario = document.getElementById("formEstudiante");

formulario.addEventListener("submit", guardarEstudiante);

function guardarEstudiante(evento) {

    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();

    const genero = document.getElementById("genero").value;

    const ingreso = document.getElementById("ingreso").value;

    const nacimiento = document.getElementById("nacimiento").value;

    const telefono = document.getElementById("telefono").value.trim();

    const nacionalidad = document.getElementById("nacionalidad").value.trim();

    const identificacion = document.getElementById("identificacion").value.trim();

    if (

        !nombre ||

        !genero ||

        !ingreso ||

        !nacimiento ||

        !telefono ||

        !nacionalidad ||

        !identificacion

    ) {

        mostrarToast("❌ Complete todos los campos");

        return;

    }

    // Validar ID único
    if (estudiantes.some(e => e.identificacion === identificacion)) {

        mostrarToast("❌ La identificación ya existe");

        return;

    }

    // Generar ID incremental
    const maxId = estudiantes.reduce((max, e) => e.id > max ? e.id : max, 0);

    const nuevo = {

        id: maxId + 1,

        nombre,

        genero,

        ingreso,

        nacimiento,

        telefono,

        nacionalidad,

        identificacion,

        estado: true

    };

    estudiantes.push(nuevo);

    guardarLocal();

    renderTabla();

    actualizarDashboard();

    cargarSelectorEstudiantes();

    cerrarModalRegistro();

    mostrarToast("✅ Estudiante registrado correctamente");

}

/*==================================================
        MODAL - REGISTRAR HISTORIAL
==================================================*/

const btnRegistrarHistorial = document.getElementById("btnRegistrarHistorial");

const cerrarModalHistorialBtn = document.getElementById("cerrarModalHistorial");

const cancelarHistorialBtn = document.getElementById("cancelarHistorial");

btnRegistrarHistorial.addEventListener("click", () => {

    cargarSelectorEstudiantes();

    modalHistorial.classList.add("activo");

});

cerrarModalHistorialBtn.addEventListener("click", cerrarModalHistorial);

cancelarHistorialBtn.addEventListener("click", cerrarModalHistorial);

function cerrarModalHistorial() {

    modalHistorial.classList.remove("activo");

    document.getElementById("formHistorial").reset();

    document.getElementById("gradoHistorial").innerHTML = "";

}

/*==================================================
        REGISTRAR HISTORIAL
==================================================*/

const formularioHistorial = document.getElementById("formHistorial");

formularioHistorial.addEventListener("submit", guardarHistorialAcademico);

function guardarHistorialAcademico(evento) {

    evento.preventDefault();

    const estudianteId = parseInt(document.getElementById("selectorEstudiante").value);

    const centro = document.getElementById("centro").value;

    const nivel = document.getElementById("nivelHistorial").value;

    const grado = document.getElementById("gradoHistorial").value;

    const anio = document.getElementById("anioHistorial").value.trim();

    const programa = document.getElementById("programaHistorial").value;

    const riesgo = document.getElementById("riesgoHistorial").value;

    if (

        !estudianteId ||

        !centro ||

        !nivel ||

        !grado ||

        !anio ||

        !programa ||

        !riesgo

    ) {

        mostrarToast("❌ Complete todos los campos");

        return;

    }

    // Verificar que el estudiante existe
    const estudiante = estudiantes.find(e => e.id === estudianteId);

    if (!estudiante) {

        mostrarToast("❌ Estudiante no encontrado");

        return;

    }

    const nuevoHistorial = {

        id: historial.length + 1,

        estudianteId: estudianteId,

        estudianteNombre: estudiante.nombre,

        edad: calcularEdad(estudiante.nacimiento),

        centro,

        nivel,

        grado,

        anio: parseInt(anio),

        programa,

        riesgo

    };

    historial.push(nuevoHistorial);

    guardarHistorial();

    renderTablaHistorial();

    renderGraficoNivel();

    renderGraficoRiesgo();

    cerrarModalHistorial();

    mostrarToast("✅ Historial registrado correctamente");

}

/*==================================================
        CALCULAR EDAD
==================================================*/

function calcularEdad(fechaNacimiento) {

    if (!fechaNacimiento) return 0;

    const hoy = new Date();

    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {

        edad--;

    }

    return edad;

}

/*==================================================
        SELECTOR ESTUDIANTES
==================================================*/

function cargarSelectorEstudiantes() {

    const selector = document.getElementById("selectorEstudiante");

    const valorActual = selector.value;

    selector.innerHTML = '<option value="">Seleccione un estudiante</option>';

    estudiantes.forEach(e => {

        selector.innerHTML += `

            <option value="${e.id}">

                ${e.id} - ${e.nombre}

            </option>

        `;

    });

    if (valorActual && estudiantes.some(e => e.id === parseInt(valorActual))) {

        selector.value = valorActual;

    }

}

/*==================================================
        GRADOS SEGÚN EL NIVEL
==================================================*/

const selectNivelHistorial = document.getElementById("nivelHistorial");

const selectGradoHistorial = document.getElementById("gradoHistorial");

selectNivelHistorial.addEventListener("change", cargarGradosHistorial);

function cargarGradosHistorial() {

    selectGradoHistorial.innerHTML = "";

    let grados = [];

    switch (selectNivelHistorial.value) {

        case "Primaria":

            grados = [
                "1°", "2°", "3°",
                "4°", "5°", "6°"
            ];

            break;

        case "Secundaria":

            grados = [
                "7°", "8°", "9°",
                "10°", "11°", "12°"
            ];

            break;

        case "Universidad":

            grados = [
                "I Año",
                "II Año",
                "III Año",
                "IV Año",
                "V Año"
            ];

            break;

        default:

            grados = [];

    }

    if (grados.length === 0) {

        selectGradoHistorial.innerHTML =

            `<option value="">Seleccione primero un nivel</option>`;

        return;

    }

    grados.forEach(grado => {

        selectGradoHistorial.innerHTML += `

        <option value="${grado}">

            ${grado}

        </option>

        `;

    });

}

/*==================================================
        TABLA HISTORIAL
==================================================*/

function renderTablaHistorial() {

    tablaHistorial.innerHTML = "";

    if (historial.length === 0) {

        tablaHistorial.innerHTML = `

        <tr>

            <td colspan="9" style="text-align:center;padding:40px;color:var(--gris);">

                No hay registros de historial académico

            </td>

        </tr>

        `;

        return;

    }

    historial.forEach(h => {

        tablaHistorial.innerHTML += `

        <tr>

            <td>${h.estudianteNombre}</td>

            <td>${h.edad}</td>

            <td>${h.centro}</td>

            <td>${h.nivel}</td>

            <td>${h.grado}</td>

            <td>${h.anio}</td>

            <td>${h.programa}</td>

            <td>

                <span class="estado ${h.riesgo === 'Bajo' ? 'activo' : h.riesgo === 'Medio' ? 'estado-medio' : 'inactivo'}"

                      style="${h.riesgo === 'Medio' ? 'background:#F39C12;' : ''}">

                    ${h.riesgo}

                </span>

            </td>

            <td>

                <button

                    class="btn-secundario"

                    onclick="eliminarHistorial(${h.id})"

                    style="background:#E74C3C;color:white;padding:6px 12px;">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==================================================
        ELIMINAR HISTORIAL
==================================================*/

function eliminarHistorial(id) {

    if (confirm("¿Está seguro de eliminar este registro de historial?")) {

        historial = historial.filter(h => h.id !== id);

        guardarHistorial();

        renderTablaHistorial();

        renderGraficoNivel();

        renderGraficoRiesgo();

        mostrarToast("✅ Historial eliminado correctamente");

    }

}