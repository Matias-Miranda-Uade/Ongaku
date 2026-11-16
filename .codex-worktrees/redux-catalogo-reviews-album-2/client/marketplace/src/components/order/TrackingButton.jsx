import { useState } from 'react'

const TrackingButton = ({ trackingCode }) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
        <button type="button" onClick={() => setVisible(value => !value)}>
            {visible ? 'Ocultar seguimiento' : 'Seguir envío'}
        </button>
        {visible && <p>Código de seguimiento: {trackingCode}</p>}
        </>
    )
}

export default TrackingButton
