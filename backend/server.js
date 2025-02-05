const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { fetchAndOrganizeData } = require('./ouraDataFetcher'); // Import data fetcher
const { convertToCSV } = require('./csvConverter'); // Import CSV conversion utility

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001;

// Base URL and API key for Oura API
const OURA_API_BASE_URL = 'https://api.ouraring.com/v2/usercollection';
const API_KEY = process.env.OURA_API_KEY;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust frontend URL in production

const start_date = "2025-01-16";
const end_date = "2025-01-23";

// ===========================
// OURA API ROUTES
// ===========================

// Fetch Sleep Data
app.get('/api/sleep', async (req, res) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/daily_sleep`, {
      params: { start_date, end_date },
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching sleep data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch sleep data' });
  }
});

// Fetch Readiness Data
app.get('/api/readiness', async (req, res) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/daily_readiness`, {
      params: { start_date, end_date },
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching readiness data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch readiness data' });
  }
});

// Fetch Activity Data
app.get('/api/activity', async (req, res) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/daily_activity`, {
      params: { start_date, end_date },
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching activity data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch activity data' });
  }
});

// Fetch Cardiovascular Age Data
app.get('/api/cardiovascular_age', async (req, res) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/daily_cardiovascular_age`, {
      params: { start_date, end_date },
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cardiovascular age:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch cardiovascular age' });
  }
});

// Resilience removed

// Fetch Stress Data
app.get('/api/stress', async (req, res) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/daily_stress`, {
      params: { start_date, end_date },
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stress data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch stress data' });
  }
});

// Fetch Heart Rate Data
// app.get('/api/heartrate', async (req, res) => {
//   try {
//     const response = await axios.get(`${OURA_API_BASE_URL}/heartrate`, {
//       params: { start_date, end_date },
//       headers: { Authorization: `Bearer ${API_KEY}` },
//     });

//     console.log('Heart Rate API Response:', JSON.stringify(response.data, null, 2));
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching heart rate data:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Failed to fetch heart rate data' });
//   }
// });

// Fetch and Organize All Data
app.get('/api/all-data', async (req, res) => {
  try {
    const data = await fetchAndOrganizeData(start_date, end_date);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/all-data:', error.message);
    res.status(500).json({ error: 'Failed to fetch and organize data.' });
  }
});

// ===========================
// CSV EXPORT ROUTE
// ===========================

app.get('/api/download-csv', async (req, res) => {
  try {
    const data = await fetchAndOrganizeData(start_date, end_date);
    const csvContent = convertToCSV(data);

    const filePath = path.join(__dirname, 'oura_data.csv');
    fs.writeFileSync(filePath, csvContent);

    res.download(filePath, 'oura_data.csv', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Failed to send CSV file.' });
      } else {
        console.log('CSV file successfully downloaded.');
      }
    });
  } catch (error) {
    console.error('Error generating CSV:', error.message);
    res.status(500).json({ error: 'Failed to generate CSV file.' });
  }
});

// ===========================
// START SERVER
// ===========================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
