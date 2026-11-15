import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVinyls } from '../../Redux/slices/catalogSlice.js';
import { fetchOrders } from '../../Redux/slices/ordersSlice.js';

const ReservationNotice = ({ expiresAt, orderId }) => {
  const dispatch = useDispatch();
  const [remaining, setRemaining] = useState(Math.max(0, expiresAt - Date.now()));
  const expired = remaining <= 0;

  useEffect(() => {
    const updateRemaining = () => setRemaining(Math.max(0, expiresAt - Date.now()));
    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    if (!expired) return undefined;
    dispatch(fetchVinyls({ force: true }));
    const refreshOrders = () => {
      dispatch(fetchOrders()).then(result => {
        if (result.error) return;
        const order = result.payload.find(item => String(item.id) === String(orderId));
        if (order?.status === 'CANCELADA') dispatch(fetchVinyls({ force: true }));
      });
    };
    refreshOrders();
    const interval = setInterval(refreshOrders, 5000);
    return () => clearInterval(interval);
  }, [dispatch, expired, orderId]);

  if (expired) {
    return (
      <p className="reservation-notice" role="status">
        La reserva venció. Actualizando el estado de tu orden…
      </p>
    );
  }

  const seconds = Math.floor(remaining / 1000);
  const minutesText = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secondsText = String(seconds % 60).padStart(2, '0');

  return (
    <p className="reservation-notice" role="status">
      Tus discos están reservados. Pagá en los próximos {minutesText}:{secondsText} o la orden se cancelará sola y el stock volverá al catálogo.
    </p>
  );
};

export default ReservationNotice;
