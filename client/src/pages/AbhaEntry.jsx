import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { apiUrl } from '../api';

export default function AbhaEntry() {
  const navigate = useNavigate();
  const [abhaId, setAbhaId] = useState('ABHA-01');
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');

  const handleFetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl(`/api/patient/${abhaId}`));
      if (!res.ok) throw new Error('Patient not found. Try ABHA-01 or ABHA-02');
      const data = await res.json();
      setPatientData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Simulate adding to queue
      const res = await fetch(apiUrl('/api/queue/add'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patientData.id })
      });
      const data = await res.json();
      // Store in local storage for demo purposes
      localStorage.setItem('currentPatientId', patientData.id);
      navigate('/patient/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (patientData) {
    return (
      <div>
        <div className="glass-card mb-4" style={{ backgroundColor: '#E6FFFA', borderColor: '#38B2AC' }}>
          <div className="flex-between">
            <div>
              <h3 className="mb-1 text-sm"><CheckCircle size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px'}}/> AI Analysis Complete</h3>
              <p className="text-xs mb-0">Patient information successfully extracted from ABHA registry.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div>
              <h2 className="mb-1">{patientData.name}</h2>
              <p className="text-sm text-muted mb-0">{patientData.id} • {patientData.age} Years • {patientData.gender}</p>
            </div>
            <span className="badge badge-success">Verified</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <p className="text-xs text-muted mb-1">Blood Group</p>
              <p className="font-bold" style={{color: 'var(--color-danger)'}}>{patientData.bloodGroup}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Status</p>
              <p className="font-bold" style={{color: 'var(--color-success)'}}>{patientData.status}</p>
            </div>
          </div>

          <h3 className="text-sm text-muted mb-2">Chronic Medical History</h3>
          {patientData.history.map((h, i) => (
            <div key={i} style={{ padding: '0.75rem', backgroundColor: '#F7FAFC', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
              <p className="text-sm font-bold mb-1">{h.condition}</p>
              <p className="text-xs text-muted mb-0">{h.details}</p>
            </div>
          ))}

          <h3 className="text-sm text-muted mb-2 mt-4">Allergies</h3>
          {patientData.allergies.map((a, i) => (
             <div key={i} style={{ padding: '0.75rem', backgroundColor: '#FFF5F5', borderRadius: '0.5rem', marginBottom: '0.5rem', borderLeft: '4px solid var(--color-danger)' }}>
             <p className="text-sm text-danger mb-0">{a}</p>
           </div>
          ))}
          
          <div className="mt-4">
             <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
               {loading ? <Loader size={18} className="animate-spin" /> : 'Confirm & Check-in'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Patient Entry</h2>
      
      <div className="card text-center mb-4">
        <QrCode size={48} color="var(--color-secondary)" style={{ margin: '0 auto 1rem auto' }} />
        <h3>Scan ABHA QR Code</h3>
        <p className="text-sm text-muted">Hold the digital or physical ABHA card steadily in front of the camera.</p>
        <button className="btn btn-outline" style={{ marginTop: '1rem' }} disabled>Simulate Scan</button>
      </div>

      <div className="card">
        <h3>Manual Entry</h3>
        <p className="text-sm text-muted mb-4">Or enter ABHA ID manually.</p>
        <input 
          type="text" 
          className="input-field" 
          value={abhaId}
          onChange={(e) => setAbhaId(e.target.value)}
          placeholder="e.g., ABHA-01"
        />
        {error && (
          <div className="mb-4" style={{ color: 'var(--color-danger)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <button className="btn btn-primary" onClick={handleFetchData} disabled={loading}>
          {loading ? <Loader size={18} className="animate-spin" /> : 'AI Patient Intake'}
        </button>
      </div>
    </div>
  );
}
