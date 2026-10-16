# Frontend de Ongaku

Frontend React de Ongaku. Combina la portada y los flujos de acceso/registro con el catálogo de vinilos, detalle, reseñas, favoritos, carrito, órdenes y perfil.

Desde esta carpeta:

Primero iniciá MySQL y el backend desde la raíz del repositorio en otra terminal:

```powershell
.\mvnw.cmd spring-boot:run
```

Después iniciá el frontend desde `client/marketplace`:

```sh
npm install
npm run dev
```

En PowerShell con scripts deshabilitados, usar `npm.cmd` en lugar de `npm`.

`npm run build` genera la compilación de producción.

Si el backend está apagado, el proxy de desarrollo devuelve 503 y un mensaje para iniciarlo. Mantené abiertas ambas terminales mientras usás la aplicación.

La navegación usa React Router, con rutas de páginas bajo `/app` y detalle de producto en `/app/catalog/:id`. Inicio permite explorar categorías; el catálogo muestra productos y permite abrir el detalle de cada vinilo.

El cliente usa las rutas del backend para autenticación, carrito, órdenes y perfil. El servidor debe estar disponible en `http://localhost:8080`; Vite reenvía las rutas de API durante el desarrollo. Si el backend escucha en otra dirección, definí `VITE_BACKEND_URL` antes de iniciar Vite. Para un despliegue sin proxy, configurá `VITE_API_BASE_URL` con la URL base de la API.

El registro e inicio de sesión guardan el token de acceso y recuperan el perfil desde el backend. El carrito de una sesión autenticada, los favoritos y las órdenes se cargan y actualizan usando la API. Las sugerencias del carrito usan el catálogo real. El checkout crea una orden desde el carrito del servidor y la dirección elegida. Desde su detalle, “Pagar orden de prueba” usa `POST /payments` con el total de la orden; el backend la marca como pagada y habilita las reseñas. Este flujo registra un pago simulado: no cobra dinero real ni solicita tarjetas. Los pagos se recuperan desde `/payments` al recargar. El perfil permite actualizar nombre, apellido, correo y contraseña.

Las direcciones se gestionan en Perfil → Direcciones, mediante GET/POST/PATCH/DELETE `/users/me/addresses`. Incluyen destinatario, calle y número, localidad, provincia, código postal, país, teléfono e indicaciones. El checkout envía `{ addressId }` en `POST /orders`; el servidor verifica que pertenezca a la cuenta y guarda una copia de sus datos en la orden. Editar o eliminar una dirección del perfil no cambia las órdenes existentes. Las órdenes históricas sin dirección siguen funcionando y pueden mostrar el aviso de envío a coordinar.

Las cuentas registradas guardan sus favoritos en `/favorites`. El carrito y los favoritos de visitantes sin sesión son temporales en memoria.

Perfil → Tarjetas permite guardar, editar y eliminar tarjetas de prueba mediante `/users/me/cards`. Se persisten solo titular, marca, últimos cuatro dígitos y vencimiento; no hay campos de base de datos para el número completo ni el código de seguridad. Las tarjetas son privadas de cada comprador y el servidor rechaza tarjetas vencidas o ajenas.

En el carrito se puede elegir una tarjeta guardada y su identificador viaja en `POST /orders` como `savedCardId`. El detalle preselecciona esa tarjeta y `POST /payments` recibe únicamente su identificador. El recibo conserva marca y últimos cuatro dígitos aunque luego se elimine la tarjeta del perfil. Sigue siendo un pago simulado, sin cargos ni conexión con una entidad financiera.

Las tarjetas de curaduría de inicio llevan a `/app/catalog?collection=:id`. Las colecciones Rock y alternativo, Jazz, Electrónica y Rock nacional filtran los géneros reales del catálogo y permiten volver a ver todos los vinilos.

Catálogo, detalle de vinilos, reseñas y audio se cargan desde el backend, sin reemplazarlos por datos de prueba cuando hay un error. El catálogo combina `/vinyls` con `/artists`, `/genres` y `/categories` para mostrar sus nombres. El detalle requiere iniciar sesión, según los permisos de la API.

Las reseñas se consultan en `/reviews` y `/reviews/vinyl/:id`; `/app/reviews?vinylId=:id` permite ver las de un producto. La creación desde las órdenes sigue usando `POST /reviews`. El autor puede editar con `PATCH /reviews/:id` y eliminar con `DELETE /reviews/:id`; el administrador puede eliminar para moderar. El backend valida la compra y los permisos.

El detalle permite publicar una reseña cuando `/reviews/vinyl/:id/eligibility` confirma una compra pagada y que no existe otra reseña del mismo autor. En las órdenes, el formulario está disponible desde `PAGADA`, también en `ENVIADA` y `ENTREGADA`. Una orden pendiente o cancelada no habilita reseñas. El estado del pago lo confirma el backend; crear una orden no la marca automáticamente como pagada.

Las tarjetas del catálogo y el detalle muestran las unidades disponibles y el estado sin stock. Los discos agotados permanecen visibles y no pueden agregarse al carrito.

`npm test` verifica las llamadas HTTP, el envío del token y el manejo de errores con respuestas simuladas de la API. No modifica la base de datos.

En administración, el formulario de vinilos permite crear un artista con «+ Nuevo artista» y selecciona el registro devuelto por `POST /artists`. Los nombres repetidos se seleccionan desde la lista existente.

«Subir imagen» envía un JPG o PNG de hasta 5 MB y 4096 × 4096 píxeles a `POST /admin/vinyls/covers`. El servidor verifica y vuelve a codificar la imagen; guarda el archivo en `uploads/covers` y el vinilo conserva una URL pública `/media/covers/:archivo`. La ruta de almacenamiento puede configurarse con `app.covers.directory`. Los archivos persisten al reiniciar y deben conservarse junto con la base de datos. Vite redirige `/media` al backend.

También se admiten enlaces directos a imágenes. El formulario informa si no cargan y espera a que termine la subida antes de guardar. Los archivos que antes se elegían como «Probar archivo local» no se habían enviado al servidor: para esos productos hay que editar el vinilo y volver a subir la portada.

El campo opcional «Link del álbum» permite guardar y editar enlaces HTTPS a álbumes de Apple Music o Spotify. Se persiste como `albumUrl` al crear o actualizar un vinilo y aparece en el detalle del cliente con el nombre de la plataforma. Dejarlo vacío elimina el enlace; una actualización parcial que omite el campo lo conserva. El formulario permite abrirlo para comprobar que corresponda al disco elegido.
