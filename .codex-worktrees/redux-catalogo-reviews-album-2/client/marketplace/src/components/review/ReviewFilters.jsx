const ReviewFilters = ({ score, onChange }) => (
  <div className="review-filters">
    <button className={score === 'all' ? 'active' : ''} onClick={() => onChange('all')}>TODAS</button>
    {[5, 4, 3, 2, 1].map((value) => (
      <button key={value} className={String(score) === String(value) ? 'active' : ''} onClick={() => onChange(String(value))}>
        {value}★
      </button>
    ))}
  </div>
)
export default ReviewFilters
