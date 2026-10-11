# Frontend de Ongaku

Frontend React de Ongaku. Combina la portada y los flujos de acceso/registro con el catálogo de vinilos, detalle, reseñas, favoritos, carrito, órdenes y perfil.

Desde esta carpeta:

```sh
npm install
npm run dev
```

En PowerShell con scripts deshabilitados, usar `npm.cmd` en lugar de `npm`.

`npm run build` genera la compilación de producción.

La navegación usa React Router, con rutas de páginas bajo `/app` y detalle de producto en `/app/catalog/:id`. Inicio permite explorar categorías; el catálogo muestra productos y permite abrir el detalle de cada vinilo.

El cliente usa las rutas del backend para autenticación, carrito, órdenes y perfil. El servidor debe estar disponible en `http://localhost:8080`; Vite reenvía las rutas de API durante el desarrollo. Si el backend escucha en otra dirección, definí `VITE_BACKEND_URL` antes de iniciar Vite. Para un despliegue sin proxy, configurá `VITE_API_BASE_URL` con la URL base de la API.

El registro e inicio de sesión guardan el token de acceso y recuperan el perfil desde el backend. El carrito de una sesión autenticada y las órdenes se cargan y actualizan usando la API. El checkout crea una orden desde el carrito del servidor; no procesa pagos. El perfil permite actualizar nombre, apellido, correo y contraseña. La API actual no ofrece persistencia de direcciones.

Los datos de catálogo, reseñas y audio todavía incluyen mocks locales como alternativa cuando esas solicitudes públicas no están disponibles.
