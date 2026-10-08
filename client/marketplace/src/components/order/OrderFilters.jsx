import { orderStatuses, statusLabels } from "../../data/orderStatuses"

const OrderFilters = ({ status, onChange }) => {

    const handleChange = (e) => { onChange(e.target.value) }

    return (
        <>
        <label>Filtrar por estado </label>
        <select value={status} onChange={handleChange}>
            <option value="TODAS">Todas</option>
            {
                orderStatuses.map((value) => (
                    <option key={value} value={value}>{statusLabels[value]}</option>
                ))
            }
        </select>
        </>
    )
}

export default OrderFilters
