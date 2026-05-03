const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// ========================
// REST API ENDPOINTS
// ========================

// 1. Get Patient by ID (ABHA Simulation)
app.get('/api/patient/:id', (req, res) => {
  const db = readDB();
  const patient = db.patients.find(p => p.id === req.params.id);
  
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: 'Patient not found. Try ABHA-01 or ABHA-02.' });
  }
});

// 2. Add Patient to Queue
app.post('/api/queue/add', (req, res) => {
  const { patientId, department } = req.body;
  const db = readDB();
  
  const patient = db.patients.find(p => p.id === patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  // Check if already in queue
  const existingQueueItem = db.queue.find(q => q.patientId === patientId);
  if (existingQueueItem) {
    return res.json({ message: 'Already in queue', queueItem: existingQueueItem });
  }

  const newQueueItem = {
    id: `Q-${Date.now()}`,
    patientId: patient.id,
    patientName: patient.name,
    department: department || 'General Consultation',
    status: 'Waiting',
    waitTimeEstimated: Math.floor(Math.random() * 20) + 5, // 5-25 mins
    joinedAt: new Date().toISOString()
  };

  db.queue.push(newQueueItem);
  writeDB(db);

  res.status(201).json({ message: 'Added to queue', queueItem: newQueueItem, position: db.queue.length });
});

// 3. Get Queue Status
app.get('/api/queue', (req, res) => {
  const db = readDB();
  res.json(db.queue);
});

// 3b. Doctor clicks "Next" - advance queue (remove first patient)
app.post('/api/queue/next', (req, res) => {
  const db = readDB();
  if (db.queue.length === 0) {
    return res.status(400).json({ error: 'Queue is empty' });
  }
  
  const removed = db.queue.shift();
  writeDB(db);
  
  res.json({ 
    message: `${removed.patientName} moved to consultation`, 
    removedPatient: removed,
    queueLength: db.queue.length 
  });
});

// 4. Mock AI - Explain Medical Report
app.post('/api/ai/report', (req, res) => {
  // Simulating an AI taking a complex report and returning simple text
  // In reality, this would call AWS Bedrock or OpenAI
  const { reportText } = req.body;
  
  setTimeout(() => {
    res.json({
      original: reportText,
      explanation: "AI Explanation: Your report indicates a mild case of iron deficiency anemia (low hemoglobin levels). However, your other metabolic panels are within the normal range. I recommend discussing an iron supplement schedule with your doctor."
    });
  }, 1500); // Simulate network/AI delay
});

// 5. Mock AI - Doctor Patient Summary
app.post('/api/ai/summary', (req, res) => {
  // Simulating an AI generating a structured summary for a doctor based on patient data
  const { patientId } = req.body;
  const db = readDB();
  const patient = db.patients.find(p => p.id === patientId);

  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  setTimeout(() => {
    res.json({
      summary: `Patient shows positive response to previous treatments. Blood pressure is stable at ${patient.vitals.bloodPressure}. Note: Patient has a history of ${patient.history[0]?.condition}. Ensure no ${patient.allergies[0]?.split(' - ')[0]} is prescribed.`,
      confidence: "94%"
    });
  }, 1200);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
