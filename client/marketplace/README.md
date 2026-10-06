# Frontend de Ongaku

Trabajo independiente del backend, basado en los componentes funcionales, props y useState del ejemplo React Hooks Demo. No incluye CSS ni los ejercicios Card, CardList y Todo.

Desde esta carpeta:

```sh
npm install
npm run dev
```

En PowerShell con scripts deshabilitados, usar `npm.cmd` en lugar de `npm`.

`npm run build` genera la compilación de producción.

La navegación se controla con estado de React. Inicio permite explorar y seleccionar una categoría; solo muestra el detalle de la selección actual. Las categorías son ejemplos locales.

Los formularios usan campos controlados y validación de campos obligatorios y email. Registro verifica que las contraseñas coincidan y requiere confirmar la creación de la cuenta de prueba. Las contraseñas se pueden mostrar y ocultar sin enviar el formulario.

Ingresar, registrarse o elegir Google/Apple simula una sesión en memoria y vuelve al inicio. No se autentican credenciales ni se crean cuentas reales. Cerrar sesión elimina el usuario del estado. Recargar pierde todo el estado. No se guardan contraseñas en la sesión, no hay almacenamiento ni llamadas al backend.
