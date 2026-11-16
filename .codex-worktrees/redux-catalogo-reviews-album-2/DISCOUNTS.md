# Descuentos de vinilos

El descuento es un porcentaje entero de 0 a 100. El backend redondea el precio
final al entero mas cercano (los medios se redondean hacia arriba).

Para modificarlo, un administrador autenticado envia:

```http
PATCH /admin/vinyls/12/discount
Authorization: Bearer <token>
Content-Type: application/json

{"discountPercentage": 20}
```

Enviar 0 elimina el descuento. Un porcentaje ausente, negativo o mayor que 100
devuelve HTTP 400. Un vinilo inexistente devuelve HTTP 404.
Tambien se acepta discountPercentage al crear o editar un vinilo; omitirlo al
editar conserva el descuento existente.

Las respuestas de catalogo, vistas previas y administracion incluyen:

```json
{
  "price": 10000,
  "originalPrice": 10000,
  "discountPercentage": 20,
  "discountAmount": 2000,
  "finalPrice": 8000
}
```

price conserva el precio original por compatibilidad. El frontend debe mostrar
finalPrice como precio de venta. En carrito y orden, unitPrice es el precio final;
los descuentos y precios informados son por unidad.

El carrito usa el descuento vigente. La orden guarda el precio original, el
porcentaje y el precio final al crearse; cambios posteriores no alteran la orden.
Las ordenes anteriores se interpretan sin descuento y mantienen sus importes.
Los filtros y el ordenamiento publicos usan el precio final redondeado; los
filtros administrativos conservan el precio original.

La configuracion actual usa spring.jpa.hibernate.ddl-auto=update: al reiniciar
el backend se agregan las columnas nuevas, con descuento 0 para datos existentes.
Las pruebas usan H2; la actualizacion de una base MySQL existente no se ejecuto
como parte de este cambio.
