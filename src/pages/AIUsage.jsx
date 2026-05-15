import { useState, useEffect, useRef } from 'react';
import { Send, Cpu, Zap, Database, MessageSquare, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AIUsage() {
  const [prompt, setPrompt] = useState('');
  const [usageData, setUsageData] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your Enterprise Assistant. I can help you analyze usage data, configure platform settings, or answer technical questions." }
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await api.get('/ai/usage');
        setUsageData(res.data);
      } catch (err) {
        console.error("Failed to fetch AI usage:", err);
      }
    };
    fetchUsage();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: userMessage.text });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Sorry, I encountered an error communicating with the server.';
      setMessages(prev => [...prev, { role: 'assistant', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">AI Usage & Assistant</h1>
          <p className="text-muted text-sm mt-1">Monitor API consumption and interact with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="glass-panel p-6 hover-card">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted font-medium">Total Tokens</div>
                  <div className="text-2xl font-bold text-text">1.2M</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 hover-card">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted font-medium">Avg Latency</div>
                  <div className="text-2xl font-bold text-text">245ms</div>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 hover-card">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted font-medium">API Calls</div>
                  <div className="text-2xl font-bold text-text">45,291</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-6">Token Consumption (Last 7 Days)</h2>
            <div className="h-[300px] w-full">
              {usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="day" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#f4f4f5' }}
                    />
                    <Bar dataKey="tokens" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted">Loading chart data...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Chat */}
        <div className="glass-panel flex flex-col h-[600px] lg:h-auto">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
            </div>
            <div>
              <h3 className="font-bold text-text">Enterprise AI</h3>
              <p className="text-xs text-green-500">Online & Ready</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Chat Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                  {msg.role === 'user' ? (
                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="User" className="w-full h-full rounded-full" />
                  ) : (
                    <BrainCircuit className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className={`${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-surface border border-border text-text/90 rounded-tl-none'
                } rounded-2xl px-4 py-2 text-sm max-w-[85%] break-words`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-border bg-background/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the AI assistant (try 'department' or 'summary')..." 
                className="w-full bg-surface border border-border rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!prompt.trim() || loading}
                className={`absolute right-2 p-2 rounded-full transition-colors ${prompt.trim() && !loading ? 'bg-primary text-white hover:bg-primary/90' : 'bg-transparent text-muted'}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted">
              <MessageSquare className="w-3 h-3" />
              AI responses may not be 100% accurate
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
