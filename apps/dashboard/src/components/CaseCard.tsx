import type { StudentCase } from '../types/crm';

type CaseCardProps = {
  item: StudentCase;
  selected?: boolean;
  onSelect?: () => void;
};

export function CaseCard({ item, selected, onSelect }: CaseCardProps) {
  return (
    <button className={`case-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div>
        <div className="case-title">{item.student}</div>
        <div className="case-meta">{item.flag} {item.university}</div>
        <div className="case-meta">{item.course}</div>
        <div className="badge-row">
          <span className={`badge ${item.urgency.color}`}>{item.urgency.level}</span>
          <span className="badge blue">{item.stage}</span>
          <span className="badge">{item.owner}</span>
          <span className="badge purple">Health {item.healthScore}</span>
        </div>
      </div>
      <div className="risk-score">
        <strong>{item.urgency.score}</strong>
        <span>risk</span>
      </div>
    </button>
  );
}
