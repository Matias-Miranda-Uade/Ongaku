import { useDispatch, useSelector } from 'react-redux'
import { selectIsTrackingOpen, toggleTracking } from '../../Redux/slices/ordersSlice'

const TrackingButton = ({ orderId, trackingCode }) => {
    const dispatch = useDispatch()
    const visible = useSelector(selectIsTrackingOpen(orderId))

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
