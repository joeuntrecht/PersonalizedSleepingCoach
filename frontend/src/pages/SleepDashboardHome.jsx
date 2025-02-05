import React, { useState } from 'react';

const SleepDashboardHome = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sleepData, setSleepData] = useState(null);

  const fetchSleepData = async () => {
    try {
      // Dynamically construct the URL with query params
      const response = await fetch(`http://localhost:5001/api/daily_sleep?start_date=${startDate}&end_date=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sleep data');
      }
      const data = await response.json();
      setSleepData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Sleep Dashboard</h1>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button onClick={fetchSleepData}>Fetch Sleep Data</button>
      {sleepData ? (
        <pre>{JSON.stringify(sleepData, null, 2)}</pre>
      ) : (
        <p>No sleep data yet. Enter dates and click fetch.</p>
      )}
    </div>
  );
};

export default SleepDashboardHome;
