const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const { parse } = require('json2csv');
const path = require('path');

dotenv.config();

const OURA_API_BASE_URL = 'https://api.ouraring.com/v2/usercollection';
const API_KEY = process.env.OURA_API_KEY;

// Helper function to fetch data from Oura API
const fetchData = async (endpoint, start_date, end_date) => {
  try {
    const response = await axios.get(`${OURA_API_BASE_URL}/${endpoint}`, {
      params: { start_date, end_date },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data.data; // Return only the `data` array
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
  }
};

// Fetch and organize all relevant data
const fetchAndOrganizeData = async (start_date, end_date) => {
  try {
    // Fetch data from all endpoints
    const [sleepData, readinessData, activityData, cardiovascularData, stressData] =
      await Promise.all([
        fetchData('daily_sleep', start_date, end_date),
        fetchData('daily_readiness', start_date, end_date),
        fetchData('daily_activity', start_date, end_date),
        fetchData('daily_cardiovascular_age', start_date, end_date),
        fetchData('daily_stress', start_date, end_date)
        // fetchData('heartrate', start_date, end_date),
      ]);

    // ✅ Log fetched heart rate data for debugging
    // console.log("Fetched Heart Rate Data:", heartRateData);

    // Organize data
    const organizedData = sleepData.map((sleepEntry) => {
      const day = sleepEntry.day; // Example: "2025-02-04"

      // ✅ Correct Filtering: Extract date from timestamp correctly
      // console.log(heartRateData)
      // const dailyHeartRates = heartRateData.filter((entry) => {
      //   const entryDate = entry.timestamp.split("T")[0]; // Extract "YYYY-MM-DD"
      //   console.log("Entry Date: " + entryDate)
      //   console.log("Day: "+ day)
      //   return entryDate === day;
      // });

      // // ✅ Log filtered heart rate readings
      // console.log(`Heart Rate Data for ${day}:`, dailyHeartRates);

      // // Compute the average heart rate for the day
      // const heartRateAvg = dailyHeartRates.length > 0
      //   ? dailyHeartRates.reduce((sum, entry) => sum + entry.bpm, 0) / dailyHeartRates.length
      //   : 0; // Use 0 if no data found

      return {
        day,
        sleep_total: sleepEntry.contributors?.total_sleep || 0,
        sleep_deep: sleepEntry.contributors?.deep_sleep || 0,
        sleep_rem: sleepEntry.contributors?.rem_sleep || 0,
        sleep_efficiency: sleepEntry.contributors?.efficiency || 0,
        sleep_latency: sleepEntry.contributors?.latency || 0,
        sleep_restfulness: sleepEntry.contributors?.restfulness || 0,
        sleep_score: sleepEntry.score || 0,
        readiness_score: readinessData.find((entry) => entry.day === day)?.score || 0,
        activity_score: activityData.find((entry) => entry.day === day)?.score || 0,
        cardiovascular_age: cardiovascularData.find((entry) => entry.day === day)?.vascular_age || 0,
        stress_seconds: stressData.find((entry) => entry.day === day)?.stress_high || 0
        // heart_rate_avg: heartRateAvg, // Fixed calculation
      };
    });

    return organizedData;
  } catch (error) {
    console.error('Error fetching and organizing data:', error.message);
    throw new Error('Failed to fetch and organize Oura data.');
  }
};

const saveDataToCSV = async (start_date, end_date) => {
  try {
      const data = await fetchAndOrganizeData(start_date, end_date);
      
      // Convert JSON to CSV
      const csv = parse(data);

      // Define file path
      const filePath = path.join(__dirname, 'oura_data.csv');

      // Write CSV to file
      fs.writeFileSync(filePath, csv);

      return filePath;
  } catch (error) {
      console.error('Error saving data to CSV:', error.message);
      throw new Error('Failed to save CSV file.');
  }
};

module.exports = { fetchAndOrganizeData, saveDataToCSV };
