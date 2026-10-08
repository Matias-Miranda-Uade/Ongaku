// Estados de una orden, tal como los maneja el back.
export const orderStatuses = ['PENDIENTE', 'PAGADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA']

// Camino normal de una orden (CANCELADA queda afuera: es una salida lateral).
export const orderFlow = ['PENDIENTE', 'PAGADA', 'ENVIADA', 'ENTREGADA']

export const statusLabels = {
    PENDIENTE: 'Pendiente',
    PAGADA: 'Pagada',
    ENVIADA: 'Enviada',
    ENTREGADA: 'Entregada',
    CANCELADA: 'Cancelada',
}
