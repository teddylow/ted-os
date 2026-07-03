type MetricCardProps = {
  icon: string;
  label: string;
  value: number | string;
  hint?: string;
  active?: boolean;
  onClick?: () => void;
};

export function MetricCard({ icon, label, value, hint, active, onClick }: MetricCardProps) {
  return (
    <button className={`metric-card ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {hint && <div className="metric-hint">{hint}</div>}
    </button>
  );
}
