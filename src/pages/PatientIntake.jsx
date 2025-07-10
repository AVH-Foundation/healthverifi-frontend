// src/pages/PatientIntake.jsx

import React, { useState } from 'react';

const PatientIntake = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [medicaidId, setMedicaidId] = useState('');
  const [eligibilityStatus, setEligibilityStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a CSV file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-patients', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadStatus(`Upload successful: ${JSON.stringify(data)}`);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  const checkEligibility = async () => {
    if (!medicaidId) {
      setEligibilityStatus('Please enter a Medicaid ID.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicaid_id: medicaidId }),
      });
      const data = await response.json();
      setEligibilityStatus(`Eligibility Status: ${JSON.stringify(data)}`);
    } catch (error) {
      setEligibilityStatus(`Check failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Intake</h1>

      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload CSV
        </button>
        {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Enter Medicaid ID"
          value={medicaidId}
          onChange={(e) => setMedicaidId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={checkEligibility}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Check Eligibility
        </button>
        {eligibilityStatus && <p className="mt-2 text-sm">{eligibilityStatus}</p>}
      </div>
    </div>
  );
};

export default PatientIntake;
