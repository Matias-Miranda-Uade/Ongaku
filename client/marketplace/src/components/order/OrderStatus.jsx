import { statusLabels } from "../../data/orderStatuses"

const OrderStatus = ({ status }) => {
    return (
        <strong>{statusLabels[status]}</strong>
    )
}

export default OrderStatus
