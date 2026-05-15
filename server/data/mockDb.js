export const db = {
  users: [
    { id: 1, name: 'Sarah Connor', email: 'admin@enterprise.com', role: 'Super Admin', status: 'Active', department: 'Executive', lastActive: new Date().toISOString() },
    { id: 2, name: 'John Smith', email: 'john.s@enterprise.com', role: 'Editor', status: 'Offline', department: 'Marketing', lastActive: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, name: 'Emma Davis', email: 'emma.d@enterprise.com', role: 'Viewer', status: 'Active', department: 'Engineering', lastActive: new Date().toISOString() },
  ],
  aiUsage: [
    { id: 1, userId: 1, prompt: 'Generate today summary', model: 'gpt-4', tokens: 1500, cost: 0.03, timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 2, userId: 2, prompt: 'Write a marketing copy', model: 'gpt-3.5', tokens: 500, cost: 0.001, timestamp: new Date(Date.now() - 86400000).toISOString() }
  ],
  analytics: {
    totalUsers: 24593,
    activeSessions: 1420,
    apiRequests: 45291,
    aiRequests: 8230,
    totalTokens: 1250000,
    systemUptime: 99.99,
    serverLoad: 42
  }
};
