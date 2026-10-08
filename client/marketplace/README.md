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

Los formularios de acceso y registro usan campos controlados y validación. El registro crea un perfil local con nombre y correo; el perfil se conserva en este navegador al recargar la página. Las contraseñas no se guardan. El acceso y los botones de Google/Apple son demostraciones: no validan credenciales ni crean cuentas en un servidor. Cerrar sesión elimina el perfil activo guardado en el navegador.

El carrito empieza vacío. Una compra de demostración crea una orden pendiente asociada al perfil local, y las órdenes aparecen en el perfil. Las cuentas nuevas no muestran direcciones ni compras inventadas.

Los datos de catálogo, reseñas y audio incluyen mocks locales. El servicio de catálogo intenta consultar el backend y usa esos mocks cuando la solicitud no está disponible.
