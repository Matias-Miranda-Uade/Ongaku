# Frontend de Ongaku

Frontend React de Ongaku. Combina la portada y los flujos de acceso/registro con el catálogo de vinilos, detalle, reseñas, favoritos, carrito, órdenes y perfil.

Desde esta carpeta:

```sh
npm install
npm run dev
```

En PowerShell con scripts deshabilitados, usar `npm.cmd` en lugar de `npm`.

`npm run build` genera la compilación de producción.

La navegación se controla con estado de React. Inicio permite explorar categorías; el catálogo muestra productos y permite abrir el detalle de cada vinilo.

Los formularios de acceso y registro usan campos controlados y validación. Ingresar, registrarse o elegir Google/Apple simula una sesión en memoria; no se autentican credenciales ni se crean cuentas reales. Cerrar sesión elimina el usuario del estado y recargar pierde la sesión.

Los datos de catálogo, reseñas, audio y perfil incluyen mocks locales. El servicio de catálogo intenta consultar el backend y usa esos mocks cuando la solicitud no está disponible.
