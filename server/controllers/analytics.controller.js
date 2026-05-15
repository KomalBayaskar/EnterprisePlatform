import { db } from '../data/mockDb.js';

export const getOverview = (req, res) => {
  // Simulate live data fluctuations
  const liveAnalytics = {
    ...db.analytics,
    activeSessions: db.analytics.activeSessions + Math.floor(Math.random() * 50) - 25,
    serverLoad: Math.max(10, Math.min(100, db.analytics.serverLoad + Math.floor(Math.random() * 10) - 5)),
    apiRequests: db.analytics.apiRequests + Math.floor(Math.random() * 10),
  };
  
  // Save the new baseline back to the mock DB so it drifts over time
  db.analytics.activeSessions = liveAnalytics.activeSessions;
  db.analytics.serverLoad = liveAnalytics.serverLoad;
  db.analytics.apiRequests = liveAnalytics.apiRequests;

  res.json(liveAnalytics);
};

export const getUsageTrends = (req, res) => {
  // Generate a live trailing trend for the last 7 data points
  const usageData = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const timePoint = new Date(now.getTime() - i * 60000); // 1 minute intervals
    const hours = timePoint.getHours().toString().padStart(2, '0');
    const mins = timePoint.getMinutes().toString().padStart(2, '0');
    
    // Create organic looking waves
    const baseLoad = 40 + Math.sin(timePoint.getTime() / 1000000) * 30;
    const baseReqs = 200 + Math.cos(timePoint.getTime() / 500000) * 150;

    usageData.push({
      time: `${hours}:${mins}`,
      load: Math.max(0, Math.min(100, Math.round(baseLoad + (Math.random() * 20 - 10)))),
      requests: Math.max(0, Math.round(baseReqs + (Math.random() * 50 - 25))),
    });
  }

  res.json(usageData);
};
