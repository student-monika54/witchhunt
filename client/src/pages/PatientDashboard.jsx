import { useState, useEffect } from 'react';
import { Activity, Loader, Bell, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { apiUrl } from '../api';

export default function PatientDashboard() {
  const [patientId, setPatientId] = useState('ABHA-01'); // Dummy patient
  const [patientData, setPatientData] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localHistory, setLocalHistory] = useState([]);

  // Fetch patient and queue status
  const refreshQueue = () => {
    fetch(apiUrl(`/api/patient/${patientId}`))
      .then(res => res.json())
      .then(data => setPatientData(data));
      
    fetch(apiUrl('/api/queue'))
      .then(res => res.json())
      .then(data => {
        const myStatus = data.find(q => q.patientId === patientId);
        if (myStatus) {
           const position = data.findIndex(q => q.patientId === patientId) + 1;
           setQueueStatus({ ...myStatus, position });
        } else {
           setQueueStatus(null);
        }
      });
  };

  useEffect(() => {
    refreshQueue();
    // Auto-refresh queue every 2 seconds
    const interval = setInterval(refreshQueue, 2000);
    return () => clearInterval(interval);
  }, [patientId]);

  useEffect(() => {
    // Load local storage history for this patient
    const key = `patientHistory_${patientId}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    setLocalHistory(history);
  }, [patientId]);

  const handleJoinQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/queue/add'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId })
      });
      const data = await res.json();
      refreshQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!patientData) return <div className="text-center mt-4">Loading...</div>;

  const combinedHistory = patientData ? [...(patientData.history || []), ...localHistory] : [];

  return (
    <div>
      <h2 className="mb-4">Welcome, {patientData.name}</h2>
      
      {queueStatus ? (
        <div className="card mb-4" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <div className="flex-center mb-4">
             <div style={{ textAlign: 'center' }}>
               <div className="text-sm" style={{ opacity: 0.8 }}>Your Position in Queue</div>
               <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>#{queueStatus.position}</div>
             </div>
          </div>
          <div className="flex-between" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
             <div>
                <div className="text-sm" style={{ opacity: 0.8 }}>Status:</div>
                <div className="font-bold">{queueStatus.status}</div>
             </div>
             <div className="text-right">
                <div className="text-sm" style={{ opacity: 0.8 }}>Wait Time:</div>
                <div className="font-bold">{queueStatus.waitTimeEstimated || 10} mins</div>
             </div>
          </div>
        </div>
      ) : (
        <div className="card text-center mb-4">
           <p className="text-muted mb-4">You are not in the queue yet.</p>
           <button className="btn btn-primary" onClick={handleJoinQueue} disabled={loading}>
             {loading ? <><Loader size={18} className="animate-spin" /> Joining...</> : '✓ Join Queue'}
           </button>
        </div>
      )}

      {/* NEW: Reminder System */}
      <div className="card mb-4" style={{ border: '2px solid #BAE6FD', backgroundColor: '#F0F9FF' }}>
        <h3 className="text-sm mb-3" style={{ color: '#0369A1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={16} /> Active Reminders
        </h3>
        
        <div style={{ backgroundColor: '#FFFBEB', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #FDE68A', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span> Take Paracetamol now!
          </div>
          <div className="text-xs mt-1 text-muted" style={{ marginLeft: '28px' }}>Scheduled for 8:00 AM</div>
        </div>

        <div style={{ backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #BBF7D0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 'bold' }}>
            <Calendar size={18} /> Next Visit: 10 May 2026
          </div>
          <div className="text-xs mt-1 text-muted" style={{ marginLeft: '26px' }}>Follow-up Appointment with Dr. Sharma</div>
        </div>
      </div>

      {/* NEW: Medicine Schedule */}
      <div className="card mb-4">
        <h3 className="text-sm text-muted mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} /> Active Prescription & Schedule
        </h3>
        <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
            <span className="font-bold">Paracetamol 500mg</span>
            <span className="badge badge-warning text-xs">Morning & Night (1-0-1)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.5rem' }}>
            <span className="font-bold">Vitamin C</span>
            <span className="badge badge-success text-xs">Afternoon only (0-1-0)</span>
          </div>
          
          <div className="mt-4">
            <h4 className="text-xs text-muted mb-2">Today's Schedule</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <CheckCircle size={14} color="var(--color-success)" /> <span className="text-sm" style={{ textDecoration: 'line-through', opacity: 0.6 }}>8:00 AM – Paracetamol</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Clock size={14} color="#D97706" /> <span className="text-sm font-bold">2:00 PM – Vitamin C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="#D97706" /> <span className="text-sm font-bold">8:00 PM – Paracetamol</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: History Timeline */}
      <div className="card">
        <h3 className="text-sm text-muted mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> My Medical History</h3>
        <div style={{ marginLeft: '0.5rem' }}>
          {combinedHistory.length > 0 ? combinedHistory.map((h, i) => (
            <div key={i} style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
              <div style={{ position: 'absolute', width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', left: '-6px', top: '4px' }}></div>
              <div className="text-xs text-muted mb-1">{h.date || 'Historical Record'}</div>
              <div className="text-sm font-bold" style={{ color: h.isDoctorNote ? '#0C5D65' : '#1A202C' }}>
                {h.condition} {h.isDoctorNote && <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '0.6rem' }}>New Note</span>}
              </div>
              <div className="text-xs text-muted" style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>{h.details}</div>
            </div>
          )) : (
            <p className="text-xs text-muted">No history found.</p>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted">Queue updates automatically • Position refreshes every 2 seconds</p>
      </div>
    </div>
  );
}
