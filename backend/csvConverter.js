const { Parser } = require('json2csv');

/**
 * Converts JSON data to CSV format.
 * Ensures only the required fields are included.
 * @param {Array} data - Array of JSON objects
 * @returns {string} CSV formatted string
 */
const convertToCSV = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid or empty data provided for CSV conversion.');
  }

  try {
    // Define the specific fields to include in the CSV output
    const fields = [
      "day",
      "sleep_total",
      "sleep_deep",
      "sleep_rem",
      "sleep_efficiency",
      "sleep_latency",
      "sleep_restfulness",
      "sleep_score",
      "readiness_score",
      "activity_score",
      "cardiovascular_age",
      "stress_seconds",
    //   "heart_rate_avg"
    ]; // Removed resilience_score

    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
  } catch (error) {
    console.error('Error converting data to CSV:', error.message);
    throw new Error('CSV conversion failed.');
  }
};

module.exports = { convertToCSV };
