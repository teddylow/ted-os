import type { Workspace } from '../types/crm';

const items: Array<{ id: Workspace; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'students', label: 'Students', icon: '👤' },
  { id: 'admissions', label: 'Admissions', icon: '🎓' },
  { id: 'visa', label: 'Visa', icon: '🛂' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'documents', label: 'Documents', icon: '📎' },
  { id: 'ai', label: 'AI Copilot', icon: '🤖' },
];

type SidebarProps = {
  active: Workspace;
  onChange: (workspace: Workspace) => void;
};

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">T</div>
        <div>
          <strong>TED OS</strong>
          <span>TEDvisory</span>
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => onChange(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
