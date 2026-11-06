import { useDispatch, useSelector } from 'react-redux'
import { toggleTracking } from '../../Redux/slices/ordersSlice'

const TrackingButton = ({ orderId, trackingCode }) => {
    const dispatch = useDispatch()
    const visible = useSelector(state => Boolean(state.orders.trackingOpen[orderId]))

    return (
        <>
        <button onClick={() => dispatch(toggleTracking(orderId))}>
            {visible ? 'Ocultar seguimiento' : 'Seguir envío'}
        </button>
        {visible && <p>Código de seguimiento: {trackingCode}</p>}
        </>
    )
}

export default TrackingButton
