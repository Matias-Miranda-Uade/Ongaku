const DashboardMetricCard = ({ label, value, hint, kana, tone = 'default', loading = false }) => (
  <article className={`metric-card metric-card-${tone}`} aria-busy={loading}>
    <header>
      <p className="metric-label">{label}</p>
      {kana && <span className="metric-kana" aria-hidden="true">{kana}</span>}
    </header>
    <p className="metric-value">{loading ? <span className="skeleton skeleton-text" /> : value}</p>
    {hint && <p className="metric-hint">{hint}</p>}
  </article>
)

export default DashboardMetricCard
