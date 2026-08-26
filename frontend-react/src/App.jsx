import { useState, useEffect, useRef } from 'react';

function App() {
  const [traffic, setTraffic] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, savings: 0 });
  const [isConnected, setIsConnected] = useState(false);
  
  // Use a ref to hold the WebSocket instance so it doesn't reset on every render
  const ws = useRef(null);

  useEffect(() => {
    // Connect to the FastAPI dashboard endpoint
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/dashboard");

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update the dashboard metrics dynamically
      setStats(prev => {
        const isBlocked = data.mitigation_action === 'BLOCK_IP';
        return {
          total: prev.total + 1,
          blocked: prev.blocked + (isBlocked ? 1 : 0),
          savings: prev.savings + (isBlocked ? 1500 : 0)
        };
      });

      // Add the new row to the top of our traffic array, keeping only the latest 50
      setTraffic(prev => [data, ...prev].slice(0, 50));
    };

    // Cleanup function: disconnects the WebSocket when the component unmounts
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <div className="bg-gray-950 text-gray-100 font-sans min-h-screen p-6">
      
      {/* Header section */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            SybilGuard Sentinel
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-Time API Abuse-Ring Mitigation Engine</p>
        </div>
        
        {/* Dynamic Status Indicator */}
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-mono text-sm">System Online (Listening)</span>
            </>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span className="text-red-500 font-mono text-sm font-bold">System Offline (Disconnected)</span>
            </>
          )}
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-gray-400 font-semibold mb-2">Total Requests Analyzed</h3>
          <p className="text-4xl font-mono text-blue-400">{stats.total}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full"></div>
          <h3 className="text-gray-400 font-semibold mb-2">Botnet Attacks Blocked</h3>
          <p className="text-4xl font-mono text-red-400">{stats.blocked}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>
          <h3 className="text-gray-400 font-semibold mb-2">Net Savings (INR)</h3>
          <p className="text-4xl font-mono text-emerald-400">₹ {stats.savings.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Calculated via False-Positive vs Fraud Delta</p>
        </div>
      </div>

      {/* Live Traffic Feed */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
          <h2 className="text-lg font-semibold text-gray-200">Live Traffic Evaluation Stream</h2>
        </div>
        <div className="h-96 overflow-y-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-900 border-b border-gray-800 text-gray-400 text-sm shadow-sm">
              <tr>
                <th className="py-3 px-6 font-medium">Txn ID</th>
                <th className="py-3 px-6 font-medium">Anomaly Score</th>
                <th className="py-3 px-6 font-medium">ML Decision</th>
                <th className="py-3 px-6 font-medium">Action Taken</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-gray-300">
              {traffic.map((row, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors animate-[fadeIn_0.3s_ease-in]">
                  <td className="py-3 px-6">{row.transaction_id}</td>
                  <td className="py-3 px-6">{row.anomaly_score.toFixed(3)}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.is_anomalous ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                      {row.is_anomalous ? 'ANOMALY DETECTED' : 'NORMAL'}
                    </span>
                  </td>
                  <td className={`py-3 px-6 ${row.is_anomalous ? 'text-red-400' : 'text-gray-400'}`}>
                    {row.mitigation_action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;