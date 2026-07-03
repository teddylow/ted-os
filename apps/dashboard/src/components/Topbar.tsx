type TopbarProps = {
  status: string;
};

export function Topbar({ status }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">TEDvisory Operating System</div>
        <h1>Good day, Teddy</h1>
        <p>Admissions, visa, finance and AI case support in one workspace.</p>
      </div>
      <div className="status-pill">{status}</div>
    </header>
  );
}
