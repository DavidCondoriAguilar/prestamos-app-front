# Arquitectura y Patrones del Proyecto: Prestamos App

Este documento describe la arquitectura, la estructura de carpetas y los patrones de diseño utilizados en esta aplicación React. El objetivo es mantener un código limpio, escalable y fácil de mantener.

## Resumen Tecnológico

- **Framework**: React 18+
- **Bundler**: Vite
- **Lenguajes**: JavaScript (JSX) y TypeScript para tipos y APIs.
- **Estilos**: Tailwind CSS
- **Routing**: React Router DOM
- **Llamadas a API**: Axios

---

## Estructura de Carpetas (`src`)

La aplicación sigue una **arquitectura por tipo de archivo** (o "Domain-Type"). Esto significa que los archivos se agrupan según su función técnica (componentes, hooks, páginas, etc.). Esta es una estructura muy común y efectiva para proyectos de tamaño pequeño a mediano.

```
src/
├── api/
├── assets/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── types/
└── utils/
```

### `src/api`

- **Propósito**: Centralizar toda la lógica de comunicación con el backend.
- **Contenido**:
    - `axiosConfig.js`: Configuración central de la instancia de Axios (URL base, interceptores, etc.).
    - `apiInterceptor.ts`: Interceptor de Axios para añadir tokens de autenticación a las cabeceras o manejar errores de forma global.
    - `authApi.ts`, `clienteApi.ts`, etc.: Archivos dedicados a los *endpoints* de una entidad específica (autenticación, clientes). Agrupar las llamadas por entidad hace que la API sea más fácil de consumir y mantener.

### `src/assets`

- **Propósito**: Almacenar todos los archivos estáticos como imágenes, fuentes o SVGs.

### `src/components`

- **Propósito**: Contener componentes de React reutilizables. La clave aquí es la **reusabilidad**.
- **Contenido**:
    - **Componentes de UI Genéricos**: Como `PdfButton.tsx` o `ProtectedRoute.jsx`, que no pertenecen a una funcionalidad específica.
    - **Subcarpetas por Feature**: Como `clientes/`, `pagos/` y `prestamos/`. Estas carpetas contienen componentes que son específicos de una funcionalidad, pero que se reutilizan en varias partes de esa misma funcionalidad (ej. `ClienteCard.jsx`, `ModalRegistroPago.jsx`).

### `src/context`

- **Propósito**: Implementar el **Patrón de State Management con Context API**.
- **Contenido**:
    - `AuthContext.jsx`: Provee el estado de autenticación (si el usuario está logueado, sus datos, etc.) a toda la aplicación. Esto evita el "prop drilling" (pasar props a través de muchos niveles de componentes).

### `src/hooks`

- **Propósito**: Almacenar "custom hooks" de React.
- **Contenido**:
    - `useClientes.js`: Un ejemplo perfecto de un custom hook. Encapsula la lógica para obtener, crear o modificar clientes, gestionando el estado, la carga y los errores de forma aislada y reutilizable.

### `src/layouts`

- **Propósito**: Definir la estructura visual principal de la aplicación.
- **Contenido**:
    - `DashboardLayout.jsx`: Podría ser un layout que incluye el `NavBar` y el `Footer` para las páginas internas.
    - `MainLayout.jsx`: Un layout más general.
    - `NavBar.jsx`, `Footer.jsx`: Componentes estructurales que definen la navegación y el pie de página.

### `src/pages`

- **Propósito**: Contener los componentes que actúan como una "página" completa, es decir, los que se asocian directamente a una ruta en el navegador.
- **Contenido**:
    - `Dashboard.jsx`, `PrestamosPage.jsx`, etc. Estos componentes suelen componerse de varios componentes más pequeños de `src/components` y `src/layouts`.

### `src/types`

- **Propósito**: Centralizar todas las definiciones de tipos de TypeScript.
- **Contenido**:
    - `clienteType.ts`, `prestamoType.ts`: Definen la "forma" de los datos que se manejan en la aplicación. Usar TypeScript aquí reduce errores y mejora el autocompletado y la mantenibilidad.

### `src/utils`

- **Propósito**: Almacenar funciones de utilidad puras y genéricas que se pueden usar en cualquier parte de la aplicación.
- **Contenido**:
    - `formatCurrency.js`: Una función que toma un número y devuelve una cadena con formato de moneda.

---

## Otros Patrones de Diseño Utilizados

Además de la estructura de carpetas, la aplicación emplea varios patrones importantes:

1.  **Component-Based Architecture**: El corazón de React. La UI se construye a partir de piezas pequeñas, independientes y reutilizables (componentes).

2.  **Single Responsibility Principle (Principio de Responsabilidad Única)**: Cada componente, hook o función tiene una única razón para existir y cambiar. Por ejemplo, `formatCurrency.js` solo formatea moneda, y `clienteApi.ts` solo se encarga de las llamadas a la API de clientes.

3.  **Separation of Concerns (Separación de Preocupaciones)**: La lógica de la UI (componentes), la lógica de negocio (hooks) y la lógica de comunicación (api) están separadas en distintas partes del código, lo que facilita su desarrollo y prueba de forma aislada.

4.  **Routing Centralizado**: En `App.jsx`, se utiliza `react-router-dom` para definir todas las rutas de la aplicación en un solo lugar, lo que da una visión clara de la navegación.

5.  **Utility-First CSS**: A través de Tailwind CSS, se aplican estilos utilizando clases de utilidad directamente en el JSX. Esto acelera el desarrollo y mantiene la consistencia visual.

---

Este README debería servir como una guía sólida para el desarrollo continuo de la aplicación. ¡Buen trabajo en la estructura inicial!