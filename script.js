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
const modalAcciones = document.getElementById("modalAcciones");

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
                    onclick="abrirModalAcciones(${estudiante.id})">

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
            ABRIR MODAL DE ACCIONES (nuevo)
==================================================*/

function abrirModalAcciones(id) {

    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) return;

    const tieneHistorial = historial.some(h => h.estudianteId === id);

    let html = `
        <div class="campo">
            <label>Nombre</label>
            <div class="valor">${estudiante.nombre}</div>
        </div>
        <div class="campo">
            <label>Estado</label>
            <div class="valor">
                <span class="estado ${estudiante.estado ? 'activo' : 'inactivo'}">
                    ${estudiante.estado ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
        <div class="campo">
            <label>Historial Académico</label>
            <div class="valor">
    `;

    if (tieneHistorial) {
        const historialEstudiante = historial.filter(h => h.estudianteId === id);
        const ultimo = historialEstudiante[historialEstudiante.length - 1];

        html += `
                <div style="margin-top:8px; font-size:14px; font-weight:normal; color:#555; line-height:1.8;">
                    <div><strong>Centro:</strong> ${ultimo.centro}</div>
                    <div><strong>Nivel:</strong> ${ultimo.nivel}</div>
                    <div><strong>Grado:</strong> ${ultimo.grado}</div>
                    <div><strong>Año:</strong> ${ultimo.anio}</div>
                    <div><strong>Programa:</strong> ${ultimo.programa}</div>
                    <div><strong>Riesgo:</strong> 
                        <span class="estado ${ultimo.riesgo === 'Bajo' ? 'activo' : ultimo.riesgo === 'Medio' ? 'estado-medio' : 'inactivo'}">
                            ${ultimo.riesgo}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="acciones-modal">
            <button class="btn-principal" onclick="irAHistorial(${id})">
                <i class="fa-solid fa-arrow-right"></i> Ir al Historial
            </button>
        </div>
        `;
    } else {
        html += `
                <div class="mensaje-sin-historial">
                    <i class="fa-solid fa-info-circle" style="font-size:20px;color:var(--morado);"></i>
                    <p style="margin-top:10px;">Este estudiante aún no posee un historial académico registrado.</p>
                </div>
            </div>
        </div>
        <div class="acciones-modal">
            <button class="btn-principal" onclick="irARegistrarHistorial(${id})">
                <i class="fa-solid fa-plus"></i> Registrar Historial
            </button>
        </div>
        `;
    }

    document.getElementById("contenidoModalAcciones").innerHTML = html;
    modalAcciones.classList.add("activo");
}

/*==================================================
        REDIRECCIONES DEL MODAL ACCIONES
==================================================*/

function irAHistorial(id) {
    modalAcciones.classList.remove("activo");

    botonesMenu.forEach(btn => btn.classList.remove("activo"));
    document.querySelector('[data-seccion="historial"]').classList.add("activo");

    paginas.forEach(sec => sec.classList.remove("activa"));
    document.getElementById("historial").classList.add("activa");

    cargarSelectorEstudiantes();
    renderTablaHistorial();

    setTimeout(() => {
        const selector = document.getElementById("selectorEstudiante");
        if (selector) {
            selector.value = id;
        }
    }, 50);
}

function irARegistrarHistorial(id) {
    modalAcciones.classList.remove("activo");

    botonesMenu.forEach(btn => btn.classList.remove("activo"));
    document.querySelector('[data-seccion="historial"]').classList.add("activo");

    paginas.forEach(sec => sec.classList.remove("activa"));
    document.getElementById("historial").classList.add("activa");

    cargarSelectorEstudiantes();

    setTimeout(() => {
        const selector = document.getElementById("selectorEstudiante");
        if (selector) {
            selector.value = id;
        }
        // Limpiar cualquier edición pendiente
        delete document.getElementById("formHistorial").dataset.editando;
        modalHistorial.classList.add("activo");
    }, 100);
}

/*==================================================
            CERRAR MODAL ACCIONES
==================================================*/

document.getElementById("cerrarModalAcciones").addEventListener("click", () => {
    modalAcciones.classList.remove("activo");
});

modalAcciones.addEventListener("click", (e) => {
    if (e.target === modalAcciones) {
        modalAcciones.classList.remove("activo");
    }
});

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
        GRÁFICO DE LÍNEAS - EVOLUCIÓN MENSUAL (nuevo)
==================================================*/

function renderGraficoLinea() {
    const canvas = document.getElementById('graficoLinea');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const ancho = canvas.width;
    const alto = canvas.height;

    const meses = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Calcular evolución de activos (simulado con datos reales)
    const activosPorMes = [];
    const totalActivos = estudiantes.filter(e => e.estado).length;

    for (let i = 0; i < 6; i++) {
        const factor = 0.65 + (i * 0.07);
        activosPorMes.push(Math.round(totalActivos * Math.min(factor, 1)));
    }

    const maxValor = Math.max(...activosPorMes) * 1.2 || 10;

    const margen = { top: 30, right: 30, bottom: 50, left: 50 };
    const anchoGrafico = ancho - margen.left - margen.right;
    const altoGrafico = alto - margen.top - margen.bottom;

    const x = (i) => margen.left + (i / (meses.length - 1)) * anchoGrafico;
    const y = (v) => margen.top + altoGrafico - (v / maxValor) * altoGrafico;

    ctx.clearRect(0, 0, ancho, alto);

    // Ejes
    ctx.beginPath();
    ctx.strokeStyle = '#E4E4E4';
    ctx.lineWidth = 1;
    ctx.moveTo(margen.left, margen.top + altoGrafico);
    ctx.lineTo(margen.left + anchoGrafico, margen.top + altoGrafico);
    ctx.moveTo(margen.left, margen.top);
    ctx.lineTo(margen.left, margen.top + altoGrafico);
    ctx.stroke();

    // Etiquetas eje X
    ctx.fillStyle = '#777';
    ctx.font = '13px Segoe UI, Arial, sans-serif';
    ctx.textAlign = 'center';
    meses.forEach((mes, i) => {
        ctx.fillText(mes, x(i), margen.top + altoGrafico + 25);
    });

    // Etiquetas eje Y
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const valor = Math.round((maxValor / 4) * i);
        const yPos = margen.top + altoGrafico - (i / 4) * altoGrafico;
        ctx.fillText(valor, margen.left - 10, yPos + 5);
        ctx.beginPath();
        ctx.strokeStyle = '#F0F0F0';
        ctx.lineWidth = 1;
        ctx.moveTo(margen.left, yPos);
        ctx.lineTo(margen.left + anchoGrafico, yPos);
        ctx.stroke();
    }

    // Área bajo la curva
    const gradiente = ctx.createLinearGradient(0, margen.top, 0, margen.top + altoGrafico);
    gradiente.addColorStop(0, 'rgba(108, 60, 225, 0.25)');
    gradiente.addColorStop(1, 'rgba(108, 60, 225, 0.02)');

    ctx.beginPath();
    ctx.moveTo(x(0), y(activosPorMes[0]));
    activosPorMes.forEach((v, i) => {
        ctx.lineTo(x(i), y(v));
    });
    ctx.lineTo(x(meses.length - 1), margen.top + altoGrafico);
    ctx.lineTo(x(0), margen.top + altoGrafico);
    ctx.closePath();
    ctx.fillStyle = gradiente;
    ctx.fill();

    // Línea principal
    ctx.beginPath();
    ctx.moveTo(x(0), y(activosPorMes[0]));
    activosPorMes.forEach((v, i) => {
        ctx.lineTo(x(i), y(v));
    });
    ctx.strokeStyle = '#6C3CE1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Puntos y etiquetas
    activosPorMes.forEach((v, i) => {
        const cx = x(i);
        const cy = y(v);

        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#6C3CE1';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Segoe UI, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(v, cx, cy - 14);
    });

    // Animación
    canvas.style.opacity = '0';
    setTimeout(() => {
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity = '1';
    }, 300);
}

/*==================================================
        GRÁFICO DONUT - DISTRIBUCIÓN POR PROGRAMA (nuevo)
==================================================*/

function renderGraficoDonut() {
    const canvas = document.getElementById('graficoDonut');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;
    const radio = 110;

    const programas = {
        'Apoyo Académico': 0,
        'Apoyo Psicológico': 0,
        'Talleres': 0
    };

    historial.forEach(h => {
        if (programas[h.programa] !== undefined) {
            programas[h.programa]++;
        }
    });

    const total = historial.length || 1;

    const colores = ['#6C3CE1', '#8B6CE6', '#B59BFF'];
    const labels = Object.keys(programas);
    const values = Object.values(programas);
    const porcentajes = values.map(v => Math.round((v / total) * 100));

    let anguloInicio = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    values.forEach((valor, i) => {
        if (valor === 0) return;

        const fraccion = valor / total;
        const anguloFin = anguloInicio + (fraccion * 2 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, radio, anguloInicio, anguloFin);
        ctx.closePath();
        ctx.fillStyle = colores[i];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (fraccion > 0.08) {
            const anguloMedio = anguloInicio + (fraccion * Math.PI);
            const textoX = centroX + (radio * 0.6) * Math.cos(anguloMedio);
            const textoY = centroY + (radio * 0.6) * Math.sin(anguloMedio);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Segoe UI, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(porcentajes[i] + '%', textoX, textoY);
        }

        anguloInicio = anguloFin;
    });

    // Círculo interior
    ctx.beginPath();
    ctx.arc(centroX, centroY, 65, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#6C3CE1';
    ctx.font = 'bold 22px Segoe UI, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centroX, centroY - 8);

    ctx.fillStyle = '#777';
    ctx.font = '12px Segoe UI, Arial, sans-serif';
    ctx.fillText('Total', centroX, centroY + 20);

    // Leyenda
    const leyenda = document.getElementById('leyendaDonut');
    if (leyenda) {
        leyenda.innerHTML = '';
        labels.forEach((label, i) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '10px';
            item.style.fontSize = '14px';
            item.style.color = '#333';

            const colorBox = document.createElement('span');
            colorBox.style.display = 'inline-block';
            colorBox.style.width = '14px';
            colorBox.style.height = '14px';
            colorBox.style.borderRadius = '4px';
            colorBox.style.background = colores[i];

            const texto = document.createElement('span');
            texto.textContent = `${label}: ${porcentajes[i]}% (${values[i]})`;

            item.appendChild(colorBox);
            item.appendChild(texto);
            leyenda.appendChild(item);
        });
    }

    canvas.style.opacity = '0';
    setTimeout(() => {
        canvas.style.transition = 'opacity 0.8s ease';
        canvas.style.opacity = '1';
    }, 400);
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

        renderGraficoLinea();

        renderGraficoDonut();

    });

/*==================================================
        ACTUALIZAR DASHBOARD
==================================================*/

renderGraficoNivel();

renderGraficoRiesgo();

renderGraficoLinea();

renderGraficoDonut();

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

                    onclick="abrirModalAcciones(${estudiante.id})">

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

        !identificacion

    ) {

        mostrarToast("❌ Complete todos los campos obligatorios");

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

        nacionalidad: nacionalidad || "Otro",

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

    delete document.getElementById("formHistorial").dataset.editando;

    modalHistorial.classList.add("activo");

});

cerrarModalHistorialBtn.addEventListener("click", cerrarModalHistorial);

cancelarHistorialBtn.addEventListener("click", cerrarModalHistorial);

function cerrarModalHistorial() {

    modalHistorial.classList.remove("activo");

    document.getElementById("formHistorial").reset();

    document.getElementById("gradoHistorial").innerHTML = "";

    delete document.getElementById("formHistorial").dataset.editando;

}

/*==================================================
        REGISTRAR / EDITAR HISTORIAL (modificado)
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

    const estudiante = estudiantes.find(e => e.id === estudianteId);

    if (!estudiante) {

        mostrarToast("❌ Estudiante no encontrado");

        return;

    }

    const editandoId = document.getElementById("formHistorial").dataset.editando;

    if (editandoId) {

        // EDITAR
        const index = historial.findIndex(h => h.id === parseInt(editandoId));

        if (index !== -1) {

            historial[index] = {

                ...historial[index],

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

            mostrarToast("✅ Historial actualizado correctamente");

        }

        delete document.getElementById("formHistorial").dataset.editando;

    } else {

        // NUEVO
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

        mostrarToast("✅ Historial registrado correctamente");

    }

    guardarHistorial();

    renderTablaHistorial();

    renderGraficoNivel();

    renderGraficoRiesgo();

    renderGraficoDonut();

    cerrarModalHistorial();

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
        TABLA HISTORIAL (modificado - agregar Editar)
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

                <span class="estado ${h.riesgo === 'Bajo' ? 'activo' : h.riesgo === 'Medio' ? 'estado-medio' : 'inactivo'}">

                    ${h.riesgo}

                </span>

            </td>

            <td>

                <button class="btn-editar" onclick="editarHistorial(${h.id})" title="Editar">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button class="btn-eliminar" onclick="eliminarHistorial(${h.id})" title="Eliminar">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*==================================================
        EDITAR HISTORIAL (nuevo)
==================================================*/

function editarHistorial(id) {

    const registro = historial.find(h => h.id === id);

    if (!registro) {

        mostrarToast('❌ Registro no encontrado');

        return;

    }

    cargarSelectorEstudiantes();

    setTimeout(() => {

        document.getElementById('selectorEstudiante').value = registro.estudianteId;

        document.getElementById('centro').value = registro.centro;

        document.getElementById('nivelHistorial').value = registro.nivel;

        cargarGradosHistorial();

        setTimeout(() => {

            document.getElementById('gradoHistorial').value = registro.grado;

        }, 50);

        document.getElementById('anioHistorial').value = registro.anio;

        document.getElementById('programaHistorial').value = registro.programa;

        document.getElementById('riesgoHistorial').value = registro.riesgo;

        document.getElementById('formHistorial').dataset.editando = id;

        modalHistorial.classList.add('activo');

    }, 100);

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

        renderGraficoDonut();

        mostrarToast("✅ Historial eliminado correctamente");

    }

}