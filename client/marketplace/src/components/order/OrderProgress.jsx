import { orderFlow, statusLabels } from "../../data/orderStatuses"

const OrderProgress = ({ status }) => {
    if (status === 'CANCELADA') {
        return <p>Esta orden fue cancelada</p>
    }

    const currentIndex = orderFlow.indexOf(status)

    return (
        <ol>
            {
                orderFlow.map((step, index) => (
                    <li key={step}>
                        {index <= currentIndex ? '✔ ' : ''}
                        {index === currentIndex
                            ? <strong>{statusLabels[step]}</strong>
                            : statusLabels[step]
                        }
                    </li>
                ))
            }
        </ol>
    )
}

export default OrderProgress
