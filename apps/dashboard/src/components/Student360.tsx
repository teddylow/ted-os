import { useState } from 'react';
import type { StudentCase } from '../types/crm';
import { progressForStage } from '../lib/stageMapping';
import { openZohoDeal } from '../lib/zohoClient';

const tabs = ['Profile', 'Application', 'Visa', 'Finance', 'Documents', 'Timeline', 'AI'] as const;

export function Student360({ item }: { item: StudentCase | null }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Profile');

  if (!item) {
    return <div className="panel empty-panel">Select a student to open Student 360.</div>;
  }

  const raw = item.raw;
  const progress = progressForStage(item.stage);

  return (
    <section className="panel student360">
      <div className="student-header">
        <div>
          <div className="eyebrow">Student 360</div>
          <h2>{item.student}</h2>
          <p>{item.university} · {item.course}</p>
        </div>
        <button className="primary-button" onClick={() => openZohoDeal(item.id)}>Open Zoho</button>
      </div>

      <div className="progress-shell">
        <div className="progress-label"><span>{item.stage}</span><strong>{progress}%</strong></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="student-summary-grid">
        <Info label="Country" value={`${item.flag} ${item.country}`} />
        <Info label="Intake" value={item.intake} />
        <Info label="Owner" value={item.owner} />
        <Info label="Health" value={`${item.healthScore}/100`} />
      </div>

      <div className="tab-row">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="tab-panel">
        {activeTab === 'Profile' && <Detail rows={[
          ['Student', item.student],
          ['Email', raw.Email || '—'],
          ['Mobile', raw.Mobile || '—'],
          ['Applicant ID', raw.Student_Applicant_ID || '—'],
          ['Student Type', raw.Student_Type || '—'],
          ['Degree Entry', raw.Degree_Entry_Level || '—'],
        ]} />}
        {activeTab === 'Application' && <Detail rows={[
          ['Institution', item.university],
          ['Course', item.course],
          ['Stage', item.stage],
          ['Submission Date', raw.Submission_Date || '—'],
          ['Offer Deadline', raw.Offer_Acceptance_Deadline || '—'],
          ['Sub Agent', raw.To_Sub_Agent || raw.Sub_Agent || '—'],
        ]} />}
        {activeTab === 'Visa' && <Detail rows={[
          ['Visa Readiness', item.bucket === 'cas' ? 'CAS requested' : 'Not yet in visa stage'],
          ['Start Date', raw.Start_Date || '—'],
          ['Days to Start', item.startCountdown === null ? '—' : `${item.startCountdown} days`],
        ]} />}
        {activeTab === 'Finance' && <Detail rows={[
          ['Tuition Fee', raw.Tuition_Fee || '—'],
          ['Expected Revenue', raw.Expected_Revenue ? String(raw.Expected_Revenue) : '—'],
          ['Scholarship', raw.Scholarships ? String(raw.Scholarships) : '—'],
        ]} />}
        {activeTab === 'Documents' && (
          <div className="detail-list">
            {(raw.Offer_Attachment || []).length ? raw.Offer_Attachment?.map((doc) => (
              <div className="detail-row" key={doc.file_Name}><span>Offer Attachment</span><strong>{doc.file_Name}</strong></div>
            )) : <p>No document attachments detected in this record.</p>}
          </div>
        )}
        {activeTab === 'Timeline' && <Detail rows={[
          ['Created', raw.Created_Time || '—'],
          ['Stage Modified', raw.Stage_Modified_Time || '—'],
          ['Last Activity', raw.Last_Activity_Time || '—'],
          ['Modified', raw.Modified_Time || '—'],
        ]} />}
        {activeTab === 'AI' && (
          <div className="ai-box">
            <strong>AI Suggested Next Action</strong>
            <p>{item.urgency.reasons[0] || 'Case appears on track. Maintain normal follow-up cadence.'}</p>
            <div className="ai-actions">
              <button>Summarise case</button>
              <button>Draft email</button>
              <button>Missing docs</button>
              <button>SOP / GS</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function Detail({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="detail-list">
      {rows.map(([label, value]) => (
        <div className="detail-row" key={label}><span>{label}</span><strong>{value}</strong></div>
      ))}
    </div>
  );
}
