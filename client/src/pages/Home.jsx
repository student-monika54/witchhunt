import { useNavigate } from 'react-router-dom';
import { User, Stethoscope } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2 className="mb-2">Welcome to LayerHealth</h2>
      <p className="text-muted mb-4">Select your role to continue</p>
      
      <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/abha')}>
        <div className="flex-center mb-2">
          <div style={{ padding: '1rem', backgroundColor: '#E6FFFA', borderRadius: '50%' }}>
            <User color="var(--color-secondary)" size={32} />
          </div>
        </div>
        <h3>Patient Simulator</h3>
        <p className="text-sm text-muted">Simulate ABHA entry, view queue, and AI insights.</p>
        <button className="btn btn-secondary">Enter as Patient</button>
      </div>

      <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', marginTop: '1rem' }} onClick={() => navigate('/doctor/dashboard')}>
        <div className="flex-center mb-2">
          <div style={{ padding: '1rem', backgroundColor: '#E2E8F0', borderRadius: '50%' }}>
            <Stethoscope color="var(--color-primary)" size={32} />
          </div>
        </div>
        <h3>Doctor Dashboard</h3>
        <p className="text-sm text-muted">View live queue and AI-synthesized patient summaries.</p>
        <button className="btn btn-primary">Enter as Doctor</button>
      </div>

      <div className="card mt-4" style={{ textAlign: 'left' }}>
        <h3 className="mb-4 text-center">Why LayerHealth?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#FFF5F5', borderRadius: '0.5rem', borderLeft: '4px solid var(--color-danger)' }}>
            <h4 className="text-sm mb-2" style={{ color: 'var(--color-danger)' }}>Without LayerHealth</h4>
            <ul className="text-sm text-muted" style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li className="mb-1">Manual paperwork</li>
              <li className="mb-1">Long waiting times</li>
              <li>No clarity in reports</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#E6FFFA', borderRadius: '0.5rem', borderLeft: '4px solid var(--color-success)' }}>
            <h4 className="text-sm mb-2" style={{ color: 'var(--color-success)' }}>With LayerHealth</h4>
            <ul className="text-sm" style={{ paddingLeft: '1.2rem', margin: 0, color: '#234E52' }}>
              <li className="mb-1">Automated documentation</li>
              <li className="mb-1">Smart queue prediction</li>
              <li>AI-powered summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
