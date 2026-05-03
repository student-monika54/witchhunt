import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AbhaEntry from './pages/AbhaEntry';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { Activity, ArrowLeft } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        {location.pathname !== '/' && (
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline" 
            style={{ padding: '0.25rem 0.5rem', position: 'absolute', left: '1rem', border: 'none', background: 'transparent' }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="header-title" onClick={() => navigate('/')} style={{ cursor: 'pointer', margin: '0 auto' }}>
          <Activity color="var(--color-primary)" size={24} />
          <span className="gradient-text">LayerHealth</span>
        </div>
        <div className="text-xs text-muted" style={{ position: 'absolute', right: '1rem' }}>MVP Demo</div>
      </header>

      <main className="content-padding">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/abha" element={<AbhaEntry />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
