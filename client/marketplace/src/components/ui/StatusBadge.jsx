const StatusBadge = ({ available }) => (
  <span className={`status-badge ${available ? 'is-available' : 'is-unavailable'}`}>
    {available ? 'EN STOCK' : 'SIN STOCK'}
  </span>
)
export default StatusBadge
