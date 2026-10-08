import { statusLabels } from "../../data/orderStatuses"

const OrderStatus = ({ status }) => {
    return (
        <strong className={`order-status order-status-${status?.toLowerCase() || 'unknown'}`}>
            <span aria-hidden="true">●</span> {statusLabels[status] || status}
        </strong>
    )
}

export default OrderStatus
