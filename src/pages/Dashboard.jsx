import { useState, useEffect } from 'react';
import { Activity, Users, Server, AlertCircle, Download, BrainCircuit, X, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="glass-panel p-6 hover-card relative overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold text-text transition-all duration-500">{value}</div>
  </div>
);

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Poll data every 3 seconds
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const [overviewRes, usageRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/usage')
        ]);
        if (isMounted) {
          setOverview(overviewRes.data);
          setUsageData(usageRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const exportToCSV = () => {
    if (usageData.length === 0) return;
    
    const headers = ['Time', 'Server Load (%)', 'API Requests'];
    const csvContent = [
      headers.join(','),
      ...usageData.map(row => `${row.time},${row.load},${row.requests}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enterprise_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateInsights = async () => {
    setIsModalOpen(true);
    setLoadingInsights(true);
    setAiInsights(null);

    const prompt = `
      You are an expert system analyst. Analyze the following real-time dashboard data and provide exactly 3 concise, actionable bullet points about the system's health. 
      Format with markdown bullet points. Do not include introductory text.
      Data: ${JSON.stringify(overview)}
    `;

    try {
      const res = await api.post('/api/ai/chat', { prompt }); // wait, the endpoint is /ai/chat
      setAiInsights(res.data.reply);
    } catch (err) {
      setAiInsights("Failed to generate insights. Ensure the AI backend is running properly.");
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted space-y-4 animate-pulse">
        <Activity className="w-12 h-12 text-primary" />
        <p>Establishing secure connection to live data streams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            Platform Overview
            <span className="relative flex h-3 w-3 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h1>
          <p className="text-muted text-sm mt-1">Live streaming metrics & analytics</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={exportToCSV} 
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group"
          >
            <Download className="w-4 h-4 mr-2 text-muted group-hover:text-text transition-colors" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Active Sessions" value={overview?.activeSessions?.toLocaleString()} icon={Users} trend={2.4} />
        <StatCard title="System Uptime" value={`${overview?.systemUptime}%`} icon={Activity} />
        <StatCard title="Server Load" value={`${overview?.serverLoad}%`} icon={Server} trend={-1.2} />
        <StatCard title="Live API Requests" value={overview?.apiRequests?.toLocaleString()} icon={AlertCircle} trend={5.8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Network Traffic & Load
              <RefreshCw className="w-4 h-4 text-muted animate-spin-slow" />
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" isAnimationActive={false} />
                <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
            Live Event Stream
            <span className="text-xs font-normal text-muted bg-surface px-2 py-1 rounded-md">Real-time</span>
          </h2>
          <div className="flex-1 space-y-4">
            {[
              { title: 'New Admin Login Detected', time: 'Just now', type: 'info' },
              { title: 'API Throttling Active', time: '1 min ago', type: 'warning' },
              { title: `Load spike: ${overview?.serverLoad}%`, time: '2 mins ago', type: overview?.serverLoad > 80 ? 'critical' : 'info' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background transition-colors animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  alert.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-blue-500'
                }`} />
                <div>
                  <h4 className="text-sm font-medium text-text">{alert.title}</h4>
                  <p className="text-xs text-muted mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <h2 className="text-lg font-bold flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
                Live System Assessment
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 min-h-[200px]">
              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                  <div className="relative">
                    <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
                    <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-muted">Gemini is analyzing the live data streams...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none text-text/90">
                  {aiInsights?.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border bg-background/50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-surface hover:bg-white/5 border border-border rounded-lg text-sm font-medium transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
