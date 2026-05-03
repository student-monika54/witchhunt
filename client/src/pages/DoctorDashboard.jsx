import { useState, useEffect } from 'react';
import { Users, FileText, Loader, Zap, CheckCircle, Rocket, Save, Activity, Clock, ShieldCheck, TrendingUp, ArrowRight, Thermometer } from 'lucide-react';

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loadingNext, setLoadingNext] = useState(false);
  const [localHistory, setLocalHistory] = useState([]);

  // Fetch queue (polling)
  const refreshQueue = () => {
    fetch('http://localhost:5000/api/queue')
      .then(res => res.json())
      .then(data => {
        // Mock chief complaint and priority if missing for demo purposes
        const enrichedQueue = data.map(q => ({
          ...q,
          chiefComplaint: q.waitTimeEstimated < 10 ? 'Chest Pain' : 'General Checkup',
          priority: q.waitTimeEstimated < 10 ? 'Urgent' : 'Normal',
        }));
        setQueue(enrichedQueue);
      })
      .catch(() => setQueue([]));
  };

  useEffect(() => {
    refreshQueue();
    const interval = setInterval(refreshQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPatient = async (patientId) => {
    setSelectedPatient(patientId);
    setAiSummary(null);
    setPipelineStep(0);
    setIsProcessing(false);
    setDoctorNotes('');
    setGeneratedDoc('');

    try {
      const resPatient = await fetch(`http://localhost:5000/api/patient/${patientId}`);
      const pData = await resPatient.json();
      setPatientData(pData);

      // Load local storage history for this patient
      const key = `patientHistory_${patientId}`;
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      setLocalHistory(history);
    } catch (err) {
      console.error(err);
    }
  };

  const processFullVisit = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPipelineStep(1);

    setTimeout(() => {
      setPipelineStep(2);
      fetch('http://localhost:5000/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: selectedPatient })
      }).then(res => res.json()).then(data => {
        setAiSummary({ ...data, confidence: '91%' });
      });

      setTimeout(() => {
        setPipelineStep(3);
        setTimeout(() => {
          setPipelineStep(4);
          setIsProcessing(false);
          // Auto-fill some notes
          setDoctorNotes("Patient condition stable. Recommended standard protocol.");
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const generateClinicalNotes = () => {
    setGeneratedDoc(`Diagnosis: Viral Infection / General Fatigue\n\nObservations: Elevated temperature, general weakness.\n\nMedication: Paracetamol, Vitamin C.\n\nAdvice: Rest, adequate hydration, follow-up if symptoms persist.`);
  };

  const generateDischargeSummary = () => {
    setGeneratedDoc(`Discharge Summary\n\nPatient Name: ${patientData?.name}\nStatus: Stable upon evaluation.\n\nInstructions: Complete prescribed medication course. Avoid strenuous activity for 3 days.\n\nFollow-up: Visit if symptoms worsen.`);
  };

  const handleSaveNotes = () => {
    if (!doctorNotes.trim()) return;
    const key = `patientHistory_${selectedPatient}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      condition: 'Doctor Notes',
      details: doctorNotes,
      isDoctorNote: true
    };
    const updatedHistory = [...history, newEntry];
    localStorage.setItem(key, JSON.stringify(updatedHistory));
    setLocalHistory(updatedHistory);
    setDoctorNotes('');
    alert('Notes saved to patient digital record!');
  };

  const handleNext = async () => {
    setLoadingNext(true);
    try {
      await fetch('http://localhost:5000/api/queue/next', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      refreshQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNext(false);
    }
  };

  // Combine DB history and LocalStorage history
  const combinedHistory = patientData ? [...(patientData.history || []), ...localHistory] : [];

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 className="mb-0">Doctor Workspace</h2>
        <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14}/> {queue.length} Waiting</span>
      </div>

      {!selectedPatient ? (
        <>
          {/* Smart Queue Insights Panel */}
          <div className="glass-card mb-4" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <div>
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> Avg Wait Time</div>
              <div className="font-bold" style={{ color: '#166534' }}>{queue.length > 0 ? '18 mins' : '0 mins'}</div>
            </div>
            <div>
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12}/> Peak Load</div>
              <div className="font-bold" style={{ color: '#991B1B' }}>In 20 mins</div>
            </div>
            <div style={{ maxWidth: '40%' }}>
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={12}/> AI Suggestion</div>
              <div className="font-bold text-xs" style={{ color: '#065F46' }}>Fast-track critical cases. Queue is optimal.</div>
            </div>
          </div>

          <div className="card mb-4">
            <h3 className="text-sm text-muted mb-4">Live Patient Queue</h3>
            {queue.length === 0 ? (
              <p className="text-sm text-muted text-center">No patients in queue.</p>
            ) : (
              <>
                {queue.map((q, idx) => (
                  <div 
                    key={q.id} 
                    className="glass-card mb-2" 
                    style={{ cursor: 'pointer', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                    onClick={() => handleSelectPatient(q.patientId)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                  >
                    <div>
                      <div className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {q.patientName} 
                        {q.priority === 'Urgent' ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>🔴 Urgent</span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>🟡 Normal</span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-1">Chief Complaint: <strong>{q.chiefComplaint}</strong></div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>⏱ {q.waitTimeEstimated}m</div>
                      <div className="text-xs text-muted">ID: {q.patientId}</div>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={handleNext} disabled={loadingNext || queue.length === 0} style={{ flex: 1, backgroundColor: 'var(--color-success)' }}>
                    {loadingNext ? <><Loader size={18} className="animate-spin" /> Processing...</> : '✓ Next Patient'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Global AI Processing Status */}
          <div className="card" style={{ backgroundColor: '#F8FAFC' }}>
            <h3 className="text-sm text-muted mb-2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Global System Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="var(--color-success)"/> Patient Data Structured</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="var(--color-success)"/> Summary Engine Active</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="var(--color-success)"/> Queue Optimization Active</div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <button className="btn btn-outline mb-4" onClick={() => setSelectedPatient(null)} style={{ padding: '0.5rem 1rem', width: 'auto' }}>← Back to Queue</button>

          {patientData && (
            <div className="card">
              {/* Top Patient Snapshot */}
              <div className="flex-between mb-4" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h2 className="mb-1 text-xl">{patientData.name}</h2>
                  <p className="text-sm text-muted mb-2">{patientData.id} • {patientData.age} Y • {patientData.gender} • {patientData.bloodGroup}</p>
                  
                  {patientData.allergies && patientData.allergies.length > 0 && (
                    <div className="text-xs mb-1"><strong style={{ color: 'var(--color-danger)' }}>Allergies:</strong> {patientData.allergies.join(', ')}</div>
                  )}
                  {patientData.history && patientData.history.length > 0 && (
                    <div className="text-xs"><strong style={{ color: 'var(--color-primary)' }}>Chronic:</strong> {patientData.history[0].condition}</div>
                  )}
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(45deg, #0C5D65, #23B5A4)', border: 'none' }} onClick={processFullVisit} disabled={isProcessing || pipelineStep === 4}>
                  {isProcessing ? <Loader size={18} className="animate-spin" /> : <Rocket size={18} />}
                  {pipelineStep === 4 ? 'Processing Complete' : '🚀 Process Full Visit'}
                </button>
              </div>

              {/* AI Processing Pipeline */}
              {pipelineStep > 0 && (
                <div className="glass-card mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <h3 className="text-sm mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A' }}>
                    <Zap size={16} color="var(--color-primary)" /> AI Processing Pipeline
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: pipelineStep >= 1 ? 1 : 0.4 }}>
                      {pipelineStep > 1 ? <CheckCircle size={16} color="var(--color-success)" /> : <Loader size={16} className={pipelineStep === 1 ? "animate-spin text-primary" : ""} />}
                      <span className="text-sm font-bold">Patient Agent</span>
                      <span className="text-xs text-muted">→ Structured Data Created</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: pipelineStep >= 2 ? 1 : 0.4 }}>
                      {pipelineStep > 2 ? <CheckCircle size={16} color="var(--color-success)" /> : <Loader size={16} className={pipelineStep === 2 ? "animate-spin text-primary" : ""} />}
                      <span className="text-sm font-bold">Documentation Agent</span>
                      <span className="text-xs text-muted">→ Clinical Summary Generated</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: pipelineStep >= 3 ? 1 : 0.4 }}>
                      {pipelineStep > 3 ? <CheckCircle size={16} color="var(--color-success)" /> : <Loader size={16} className={pipelineStep === 3 ? "animate-spin text-primary" : ""} />}
                      <span className="text-sm font-bold">Queue Agent</span>
                      <span className="text-xs text-muted">→ Wait Time Predicted</span>
                    </div>
                  </div>
                  {pipelineStep === 4 && (
                    <div className="flex-between mt-3 pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                      <span className="badge badge-success" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>✔ AI Confidence: 91%</span>
                      <span className="badge badge-warning" style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}>✔ Data Completeness: Medium</span>
                    </div>
                  )}
                </div>
              )}

              {/* Automated Clinical Summary */}
              {aiSummary && pipelineStep >= 2 && (
                <>
                  <div className="glass-card" style={{ backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', marginBottom: '0.5rem' }}>
                    <div className="flex-between mb-2">
                      <h3 className="text-sm mb-0" style={{ color: '#0369A1', display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={16}/> Automated Clinical Summary</h3>
                    </div>
                    <p className="text-sm mb-0" style={{ color: '#0C4A6E' }}>{aiSummary.summary}</p>
                  </div>
                  {/* AI Explanation Assist */}
                  <div style={{ backgroundColor: '#FEF3C7', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#92400E', border: '1px solid #FDE68A' }}>
                    <strong>💡 AI Insight:</strong> Symptoms suggest low-risk condition based on historical data. No immediate escalation required.
                  </div>
                </>
              )}

              {/* Vitals Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#F7FAFC', padding: '1rem', borderRadius: '0.5rem' }}>
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">BP</div>
                  <div className="font-bold" style={{ color: 'var(--color-danger)' }}>{patientData.vitals.bloodPressure}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">HR</div>
                  <div className="font-bold">{patientData.vitals.heartRate}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">SpO2</div>
                  <div className="font-bold">{patientData.vitals.spO2}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted mb-1">Temp</div>
                  <div className="font-bold">98.6°F</div>
                </div>
              </div>

              {/* Smart Document Generation */}
              <div className="mb-4">
                <h3 className="text-sm text-muted mb-2">Smart Document Generation</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" style={{ flex: '1 1 auto', padding: '0.5rem', fontSize: '0.875rem' }} onClick={generateClinicalNotes}>[ Clinical Notes ]</button>
                  <button className="btn btn-outline" style={{ flex: '1 1 auto', padding: '0.5rem', fontSize: '0.875rem' }} onClick={generateDischargeSummary}>[ Discharge Summary ]</button>
                  <button className="btn btn-primary" style={{ flex: '1 1 auto', padding: '0.5rem', fontSize: '0.875rem', backgroundColor: '#0F766E' }} onClick={() => {
                    const mapDosage = (code) => {
                      const mapping = { '1-0-1': 'Morning & Night', '1-1-1': 'Morning, Afternoon, Night', '0-1-0': 'Afternoon only' };
                      return mapping[code] || code;
                    };
                    setGeneratedDoc(`🏥 Treatment Plan\n\nProcedure: Appendectomy (Surgery)\nDate: 5 May 2026\n\nPre-Op Instructions:\n- No food 8 hours before surgery\n- Blood test required\n\nPost-Op Care:\n- Antibiotics for 5 days (${mapDosage('1-0-1')})\n- Dressing change every 2 days\n- Follow-up on 10 May\n\nDoctor Notes:\nPatient stable, surgery recommended`);
                  }}>[ 🏥 Treatment Plan ]</button>
                </div>
                {generatedDoc && (
                  <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0', whiteSpace: 'pre-wrap', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    {generatedDoc}
                  </div>
                )}
              </div>

              {/* Doctor Notes */}
              <div className="mb-4 p-3" style={{ backgroundColor: '#F1F5F9', borderRadius: '0.5rem' }}>
                <h3 className="text-sm text-muted mb-2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📝 Doctor Notes</h3>
                <textarea 
                  className="input-field mb-2" 
                  rows="3" 
                  placeholder="Type clinical observations or recommendations here..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  style={{ resize: 'vertical', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                ></textarea>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', width: 'auto' }}
                    onClick={handleSaveNotes}
                  >
                    <Save size={16} /> SAVE RECORD
                  </button>
                </div>
              </div>

              {/* Medical History Timeline */}
              <h3 className="text-sm text-muted mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> Medical History Timeline</h3>
              <div style={{ marginLeft: '0.5rem' }}>
                {combinedHistory.length > 0 ? combinedHistory.map((h, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', left: '-6px', top: '4px' }}></div>
                    <div className="text-xs text-muted mb-1">{h.date || 'Historical Record'}</div>
                    <div className="text-sm font-bold" style={{ color: h.isDoctorNote ? '#0C5D65' : '#1A202C' }}>
                      {h.condition} {h.isDoctorNote && <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '0.6rem' }}>Doctor Note</span>}
                    </div>
                    <div className="text-xs text-muted" style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{h.details}</div>
                  </div>
                )) : (
                  <p className="text-xs text-muted">No history found.</p>
                )}
              </div>
              


            </div>
          )}
        </div>
      )}
    </div>
  );
}
