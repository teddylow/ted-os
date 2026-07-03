import { useEffect, useMemo, useState } from 'react';
import { CaseCard } from './components/CaseCard';
import { MetricCard } from './components/MetricCard';
import { Sidebar } from './components/Sidebar';
import { Student360 } from './components/Student360';
import { Topbar } from './components/Topbar';
import { initializeZohoApp, loadVisaCases, loadZohoDeals } from './lib/zohoClient';
import { normalizeDeal } from './lib/normalizeDeal';
import { APPLICATION_STAGES, VISA_STAGES } from './lib/stageMapping';
import type { CaseBucket, StudentCase, VisaCase, Workspace } from './types/crm';

const metricDefs: Array<{ key: CaseBucket; label: string; icon: string }> = [
  { key: 'urgent', label: 'Urgent', icon: '🔥' },
  { key: 'applications', label: 'Applications', icon: '📄' },
  { key: 'offer', label: 'Offers', icon: '🎓' },
  { key: 'cas', label: 'CAS', icon: '📑' },
  { key: 'visa', label: 'Visa', icon: '🛂' },
  { key: 'won', label: 'Won', icon: '✅' },
];

export function DashboardApp() {
  const [workspace, setWorkspace] = useState<Workspace>('dashboard');
  const [cases, setCases] = useState<StudentCase[]>([]);
  const [visaCases, setVisaCases] = useState<VisaCase[]>([]);
  const [status, setStatus] = useState('Starting TED OS…');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CaseBucket | 'all'>('all');

  useEffect(() => {
    async function boot() {
      setStatus('Connecting to Zoho CRM…');
      await initializeZohoApp();
      const [deals, visas] = await Promise.all([loadZohoDeals(), loadVisaCases()]);
      const normalized = deals.map(normalizeDeal);
      setCases(normalized);
      setVisaCases(visas);
      setSelectedId(normalized[0]?.id || null);
      setStatus(`Connected · ${deals.length} applications · ${visas.length} visa cases`);
    }

    boot().catch((error) => {
      console.error(error);
      setStatus('Unable to load Zoho CRM data');
    });
  }, []);

  const selectedCase = cases.find((item) => item.id === selectedId) || cases[0] || null;

  const counts = useMemo(() => {
    const base: Record<string, number> = {};
    for (const metric of metricDefs) base[metric.key] = 0;
    for (const item of cases) {
      if (item.urgency.score >= 40) base.urgent += 1;
      if (base[item.bucket] !== undefined) base[item.bucket] += 1;
    }
    base.visa = visaCases.length;
    return base;
  }, [cases, visaCases]);

  const filteredCases = useMemo(() => {
    return cases
      .filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'urgent') return item.urgency.score >= 40;
        return item.bucket === filter;
      })
      .sort((a, b) => b.urgency.score - a.urgency.score);
  }, [cases, filter]);

  return (
    <div className="os-layout">
      <Sidebar active={workspace} onChange={setWorkspace} />
      <main className="os-main">
        <Topbar status={status} />

        {workspace === 'dashboard' && (
          <>
            <section className="hero-card">
              <span className="pill">Today</span>
              <h2>{counts.urgent || 0} cases need attention</h2>
              <p>Your priority queue across admissions, offers, CAS, visa and finance.</p>
            </section>

            <section className="metric-grid">
              {metricDefs.map((metric) => (
                <MetricCard
                  key={metric.key}
                  icon={metric.icon}
                  label={metric.label}
                  value={counts[metric.key] || 0}
                  active={filter === metric.key}
                  onClick={() => setFilter(filter === metric.key ? 'all' : metric.key)}
                />
              ))}
            </section>

            <section className="workspace-grid">
              <div className="panel">
                <div className="panel-header"><div><div className="eyebrow">Priority queue</div><h3>Today’s work</h3></div></div>
                <div className="case-list">
                  {filteredCases.map((item) => (
                    <CaseCard key={item.id} item={item} selected={selectedCase?.id === item.id} onSelect={() => setSelectedId(item.id)} />
                  ))}
                </div>
              </div>
              <Student360 item={selectedCase} />
            </section>
          </>
        )}

        {workspace === 'students' && (
          <section className="workspace-grid">
            <div className="panel">
              <div className="panel-header"><div><div className="eyebrow">Students</div><h3>All student cases</h3></div></div>
              <div className="case-list">
                {cases.map((item) => <CaseCard key={item.id} item={item} selected={selectedCase?.id === item.id} onSelect={() => setSelectedId(item.id)} />)}
              </div>
            </div>
            <Student360 item={selectedCase} />
          </section>
        )}

        {workspace === 'admissions' && <Board title="Admissions Board" stages={APPLICATION_STAGES} cases={cases} />}
        {workspace === 'visa' && <VisaBoard cases={visaCases} />}
        {workspace === 'finance' && <Finance cases={cases} />}
        {workspace === 'documents' && <Documents cases={cases} />}
        {workspace === 'ai' && <AICopilot cases={cases} />}
      </main>
    </div>
  );
}

function Board({ title, stages, cases }: { title: string; stages: string[]; cases: StudentCase[] }) {
  return (
    <section className="panel">
      <div className="panel-header"><div><div className="eyebrow">Workspace</div><h3>{title}</h3></div></div>
      <div className="board">
        {stages.map((stage) => {
          const items = cases.filter((item) => item.stage === stage);
          return (
            <div className="board-column" key={stage}>
              <div className="board-title"><strong>{stage}</strong><span>{items.length}</span></div>
              {items.map((item) => <div className="mini-card" key={item.id}><strong>{item.student}</strong><span>{item.university}</span><em>{item.stageAge ?? '—'}d</em></div>)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VisaBoard({ cases }: { cases: VisaCase[] }) {
  return (
    <section className="panel">
      <div className="panel-header"><div><div className="eyebrow">Visa Team</div><h3>Visa Board</h3></div></div>
      <div className="board">
        {VISA_STAGES.map((stage) => {
          const items = cases.filter((item) => item.stage === stage);
          return (
            <div className="board-column" key={stage}>
              <div className="board-title"><strong>{stage}</strong><span>{items.length}</span></div>
              {items.map((item) => <div className="mini-card" key={item.id}><strong>{item.student}</strong><span>{item.visaType}</span><em>{item.daysInStage}d</em></div>)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Finance({ cases }: { cases: StudentCase[] }) {
  const revenue = cases.reduce((sum, item) => sum + (item.raw.Expected_Revenue || 0), 0);
  return (
    <section className="panel">
      <div className="panel-header"><div><div className="eyebrow">Finance</div><h3>Finance Overview</h3></div></div>
      <div className="metric-grid">
        <MetricCard icon="💰" label="Expected Revenue" value={`RM ${revenue.toLocaleString()}`} />
        <MetricCard icon="🎓" label="Applications" value={cases.length} />
        <MetricCard icon="📑" label="CAS Queue" value={cases.filter((c) => c.bucket === 'cas').length} />
      </div>
      <div className="table-list">
        {cases.map((item) => <div className="table-row" key={item.id}><strong>{item.student}</strong><span>{item.raw.Tuition_Fee || 'Tuition n/a'}</span><span>{item.raw.Expected_Revenue ? `RM ${item.raw.Expected_Revenue}` : 'Revenue n/a'}</span></div>)}
      </div>
    </section>
  );
}

function Documents({ cases }: { cases: StudentCase[] }) {
  return (
    <section className="panel">
      <div className="panel-header"><div><div className="eyebrow">Documents</div><h3>Document Centre</h3></div></div>
      <div className="table-list">
        {cases.map((item) => <div className="table-row" key={item.id}><strong>{item.student}</strong><span>{item.raw.Offer_Attachment?.[0]?.file_Name || 'No offer attachment detected'}</span><span>{item.stage}</span></div>)}
      </div>
    </section>
  );
}

function AICopilot({ cases }: { cases: StudentCase[] }) {
  const urgent = cases.filter((item) => item.urgency.score >= 40);
  return (
    <section className="panel ai-workspace">
      <div className="panel-header"><div><div className="eyebrow">TED AI</div><h3>AI Copilot</h3></div></div>
      <div className="ai-box large">
        <strong>Morning Brief</strong>
        <p>{urgent.length} cases need attention. Highest priority: {urgent[0]?.student || 'No urgent cases'}.</p>
      </div>
      <div className="ai-actions">
        <button>Summarise urgent cases</button>
        <button>Draft university follow-up</button>
        <button>Check missing documents</button>
        <button>Prepare visa reminder</button>
      </div>
    </section>
  );
}
