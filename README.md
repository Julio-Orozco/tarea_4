# 🎓 EduGestor

**Sistema de gestión y seguimiento estudiantil**

---

## 📌 Descripción

EduGestor es una plataforma web diseñada para la administración de información estudiantil y el seguimiento académico. Fue desarrollada como parte de la **Tarea 4** del curso de **Programación Web**, basada en el diseño conceptual definido en la **Tarea 3**.

La plataforma permite:

* Gestionar información personal de estudiantes (registro, edición, activación/desactivación).
* Llevar un historial académico por cada estudiante.
* Visualizar estadísticas y métricas clave mediante un dashboard interactivo.

---

## 🎯 Propósito del sistema

EduGestor está pensado para instituciones educativas que necesitan una herramienta sencilla, intuitiva y visual para:

1. Centralizar la información de los estudiantes.
2. Monitorear el seguimiento académico.
3. Visualizar métricas relevantes mediante gráficos interactivos.
4. Facilitar la consulta y administración de la información estudiantil.

---

## 🧠 Basado en la Tarea 3

La estructura y funcionalidades de EduGestor fueron definidas en la **Tarea 3**, donde se realizó:

* Análisis de usuarios.
* Flujo de navegación.
* Diseño de interfaces.
* Definición de módulos.
* Arquitectura de la aplicación.

Este repositorio representa la implementación funcional del diseño propuesto anteriormente.

---

# 🚀 Tecnologías utilizadas

| Tecnología           | Propósito                                     |
| -------------------- | --------------------------------------------- |
| HTML5                | Estructura de la aplicación                   |
| CSS3                 | Diseño visual y experiencia de usuario        |
| JavaScript (Vanilla) | Lógica, interactividad y manipulación del DOM |
| Canvas API           | Creación de gráficos personalizados           |
| Font Awesome         | Iconografía                                   |
| LocalStorage         | Persistencia de datos en el navegador         |

---

# 📁 Estructura del proyecto

```text
EduGestor/
│
├── index.html        # Página principal
├── styles.css        # Estilos de la aplicación
├── script.js         # Lógica del sistema
├── README.md         # Documentación
└── .gitignore
```

---

# 🔧 Ejecución del proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/edugestor.git
```

## 2. Abrir el proyecto

Puedes abrir el archivo:

```text
index.html
```

directamente desde el navegador o utilizar una extensión como **Live Server** en Visual Studio Code.

---

# 💾 Persistencia de datos

La aplicación utiliza **LocalStorage**, por lo que:

* Los estudiantes registrados permanecen almacenados.
* Los historiales académicos permanecen almacenados.
* Las modificaciones se conservan al recargar la página.
* No se requiere un servidor o base de datos para ejecutar el proyecto.

---

# 🧩 Funcionalidades principales

## 📊 Dashboard

Incluye indicadores y gráficos interactivos para visualizar información relevante.

### KPIs

* Total de estudiantes
* Estudiantes activos
* Estudiantes inactivos
* Tasa de éxito

### Gráficos

* Distribución por nivel académico.
* Análisis de riesgo.
* Evolución mensual de estudiantes activos.
* Distribución por programa mediante gráfico de anillo (Donut).

### Funcionalidades

* Filtros interactivos.
* Actualización automática de indicadores.
* Animaciones de carga.

---

## 👨‍🎓 Gestión de Estudiantes

Permite administrar la información personal de los estudiantes.

### Registro

Cada estudiante almacena:

* Nombre
* Género
* Fecha de ingreso
* Fecha de nacimiento
* Teléfono
* Nacionalidad
* Identificación

### Funcionalidades

* Registro de nuevos estudiantes.
* Activación y desactivación.
* Búsqueda por nombre o identificación.
* Visualización rápida de información.
* Acceso al historial académico.

---

## 📚 Historial Académico

Permite administrar la información académica de cada estudiante.

Cada historial almacena:

* Centro Educativo
* Nivel Académico
* Grado
* Año
* Programa
* Nivel de Riesgo

### Funcionalidades

* Registrar historial.
* Editar historial.
* Eliminar historial.
* Consulta rápida desde el módulo de estudiantes.

---

# 👥 Usuarios del sistema

| Usuario       | Funciones                                              |
| ------------- | ------------------------------------------------------ |
| Administrador | Gestiona estudiantes, historiales y dashboard          |
| Docente       | Consulta información y registra historiales académicos |

---

# 🎨 Principios de UX aplicados

| Principio            | Aplicación                                        |
| -------------------- | ------------------------------------------------- |
| Claridad             | Formularios y etiquetas descriptivas              |
| Consistencia         | Colores, botones y estilos uniformes              |
| Jerarquía visual     | Dashboard organizado mediante tarjetas y gráficos |
| Navegación intuitiva | Sidebar permanente                                |
| Retroalimentación    | Toast Notifications para informar acciones        |
| Diseño Responsivo    | Adaptación a escritorio, tablet y móvil           |

---

# 🤖 Uso de Inteligencia Artificial (Vibe Coding)

Durante el desarrollo se utilizaron herramientas de Inteligencia Artificial para apoyar distintas etapas del proyecto.

## Herramientas utilizadas

* ChatGPT
* DeepSeek

## Aplicaciones

* Creación de componentes HTML.
* Diseño de estilos CSS.
* Desarrollo de lógica JavaScript.
* Construcción de gráficos Canvas.
* Organización y documentación del código.

## Ejemplos de prompts utilizados

* Se realizo desde un pdf y así se envió a la IA, se adjunta en la entrega de la tarea

## Ajustes manuales realizados

Posteriormente se realizaron modificaciones manuales para:

* Adaptar el diseño a la identidad visual del proyecto.
* Mejorar la distribución de los componentes.
* Ajustar colores.
* Mejorar la navegación.
* Optimizar la experiencia de usuario.
* Corregir la lógica de interacción entre módulos.

---

# 🧪 Pruebas realizadas

Se verificó el correcto funcionamiento de:

* ✅ Registro de estudiantes.
* ✅ Validación de formularios.
* ✅ Activación y desactivación de estudiantes.
* ✅ Registro de historiales académicos.
* ✅ Edición de historiales.
* ✅ Eliminación de historiales.
* ✅ Persistencia mediante LocalStorage.
* ✅ Búsqueda de estudiantes.
* ✅ Dashboard interactivo.
* ✅ Filtros por gráficos.
* ✅ Navegación entre módulos.
* ✅ Diseño responsivo.

---

# 📦 Entregable

El repositorio contiene:

* `index.html`
* `styles.css`
* `script.js`
* `README.md`
* `.gitignore`

Como complemento del proyecto se incluye la documentación correspondiente a la **Tarea 3**, la cual contiene el diseño conceptual, la arquitectura y el análisis previo utilizados como base para el desarrollo de EduGestor.