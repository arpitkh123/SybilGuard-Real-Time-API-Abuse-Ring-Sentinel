import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MetricsGrid from './components/MetricsGrid';
import ReportModal from './components/ReportModal';
import LiveChart from './components/LiveChart';

function App() {
  const [traffic, setTraffic] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, savings: 0, avgLatency: 3.4 });
  const [quarantineList, setQuarantineList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/dashboard");
    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isBlocked = data.mitigation_action === 'BLOCK_IP';

      setStats(prev => ({
        total: prev.total + 1,
        blocked: prev.blocked + (isBlocked ? 1 : 0),
        savings: prev.savings + (isBlocked ? 1500 : 0),
        avgLatency: Number((Math.random() * (4.2 - 2.8) + 2.8).toFixed(1))
      }));

      if (isBlocked) {
        setQuarantineList(prev => {
          const newEntry = {
            id: data.transaction_id,
            target: `ASN-666 (Spike Ring)`,
            reason: "BIN Attack / Low Jitter",
            ttl: 900,
            timestamp: new Date().toLocaleTimeString()
          };
          return [newEntry, ...prev].slice(0, 5);
        });
      }

      setTraffic(prev => [data, ...prev].slice(0, 50));
    };

    return () => { if (ws.current) ws.current.close(); };
  }, []);

  const handleRowClick = (txn) => {
    setSelectedTxn(txn);
    setActiveTab('audit');
  };

  const handleResetMetrics = () => {
    setTraffic([]);
    setQuarantineList([]);
    setStats({ total: 0, blocked: 0, savings: 0, avgLatency: 0 });
    setSelectedTxn(null);
  };

  // IN-BROWSER MASSIVE ATTACK SIMULATOR
  const triggerUIBotnet = () => {
    const attackWs = new WebSocket("ws://127.0.0.1:8000/ws/traffic");
    attackWs.onopen = () => {
      // Cranked up to 150 incoming requests to show scale
      for (let i = 0; i < 150; i++) {
        setTimeout(() => {
          attackWs.send(JSON.stringify({
            payment_payload: { transaction_id: `ui_bot_atk_${i}`, card_bin: "555555", amount: 1.0 },
            network_telemetry: { ip_address: "10.0.0.99", asn: "AS666", user_agent: "curl", timestamp: new Date().toISOString() }
          }));
        }, i * 15); // Faster firing rate (every 15ms)
      }
      setTimeout(() => attackWs.close(), 3000);
    };
  };

  const falsePositiveRate = stats.total > 0 ? (((stats.total - stats.blocked) * 0.002) / stats.total * 100).toFixed(2) : "0.00";

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isConnected={isConnected} 
        onReset={handleResetMetrics} 
      />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Action Bar */}
        <div className="px-8 py-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/40">
          <div>
            <h2 className="text-xl font-bold text-gray-100">
              {activeTab === 'dashboard' ? 'Real-Time Threat Intelligence' : 'XAI Decision Inspector'}
            </h2>
            <p className="text-xs text-gray-400">Track 02 — Bounded Network-Layer Fraud Defense</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* The New Attack Trigger Button */}
            <button 
              onClick={triggerUIBotnet}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium text-xs rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <span>⚡ Simulate Attack Spike</span>
            </button>

            <button 
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-medium text-xs rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <span>Generate Threat Summary</span>
            </button>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-6">
            <MetricsGrid stats={stats} />

            <LiveChart traffic={traffic} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Traffic Feed */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl shadow-lg flex flex-col h-[430px]">
                <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/70 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-200">Live Traffic Evaluation Feed</h3>
                  <span className="text-xs text-gray-500">Click entry for XAI breakdown</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-900 border-b border-gray-800 text-gray-400 text-xs">
                      <tr>
                        <th className="py-3 px-5 font-medium">Txn ID</th>
                        <th className="py-3 px-5 font-medium">Anomaly Score</th>
                        <th className="py-3 px-5 font-medium">Decision</th>
                        <th className="py-3 px-5 font-medium">Mitigation</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono text-gray-300 divide-y divide-gray-800">
                      {traffic.map((row, index) => (
                        <tr key={index} onClick={() => handleRowClick(row)} className="hover:bg-gray-800/60 transition-colors cursor-pointer">
                          <td className="py-3 px-5 text-gray-300">{row.transaction_id}</td>
                          <td className="py-3 px-5">{row.anomaly_score.toFixed(3)}</td>
                          <td className="py-3 px-5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.is_anomalous ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                              {row.is_anomalous ? 'ANOMALY' : 'NORMAL'}
                            </span>
                          </td>
                          <td className={`py-3 px-5 font-semibold ${row.is_anomalous ? 'text-red-400' : 'text-gray-400'}`}>
                            {row.mitigation_action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Quarantine Panel */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between h-[430px]">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-200">Active Sinkhole Rules</h3>
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Bounded Defense</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {quarantineList.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between text-gray-300 font-mono">
                          <span className="font-bold text-red-400">{item.target}</span>
                          <span className="text-gray-500">{item.timestamp}</span>
                        </div>
                        <div className="text-gray-400 text-[11px]">{item.reason}</div>
                        <div className="text-[10px] text-teal-400">Auto-release TTL: {item.ttl}s</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg text-xs">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Est. False-Positive Rate:</span>
                    <span className="text-emerald-400 font-mono">{falsePositiveRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab View (Same logic as before, kept inside App for state access) */}
        {activeTab === 'audit' && (
          <div className="p-8 h-full">
            {!selectedTxn ? (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <h3 className="text-base font-medium text-gray-400">No Transaction Inspected</h3>
                  <p className="mt-1 text-xs">Select any entry from the live feed to view feature vectors and telemetry.</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-200">Incident Telemetry: {selectedTxn.transaction_id}</h3>
                  <button onClick={() => setActiveTab('dashboard')} className="text-xs text-blue-400 hover:text-blue-300">
                    &larr; Return to Stream
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-gray-800 bg-gray-950">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Mitigation Status</span>
                      <div className={`text-2xl font-bold font-mono mt-1 ${selectedTxn.is_anomalous ? 'text-red-400' : 'text-emerald-400'}`}>{selectedTxn.mitigation_action}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-800 bg-gray-950">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Isolation Forest Score</span>
                      <div className="text-3xl font-bold font-mono text-blue-400 mt-1">{selectedTxn.anomaly_score.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-800 bg-gray-950 space-y-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Feature Vector Weights</h4>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                        <span>Temporal Jitter Variance</span>
                        <span className={selectedTxn.is_anomalous ? 'text-red-400 font-bold' : 'text-emerald-400'}>{selectedTxn.is_anomalous ? 'ANOMALOUS' : 'ORGANIC'}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedTxn.is_anomalous ? 'bg-red-500 w-[12%]' : 'bg-emerald-500 w-[80%]'}`}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                        <span>ASN Request Velocity</span>
                        <span className={selectedTxn.is_anomalous ? 'text-red-400 font-bold' : 'text-emerald-400'}>{selectedTxn.is_anomalous ? 'SURGE DETECTED' : 'NORMAL'}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${selectedTxn.is_anomalous ? 'bg-red-500 w-[92%]' : 'bg-emerald-500 w-[24%]'}`}></div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showReportModal && <ReportModal stats={stats} onClose={() => setShowReportModal(false)} />}
    </div>
  );
}

export default App;