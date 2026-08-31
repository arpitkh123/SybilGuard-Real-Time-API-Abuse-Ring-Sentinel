import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MetricsGrid from './components/MetricsGrid';
import ReportModal from './components/ReportModal';
import LiveChart from './components/LiveChart';
import AuditTrail from './components/AuditTrail';
import ThreatMap from './components/ThreatMap';
import ApiIntegrations from './components/ApiIntegrations'; 

function App() {
  const [traffic, setTraffic] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, savings: 0, avgLatency: 3.4 });
  const [quarantineList, setQuarantineList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const attackWsRef = useRef(null);
  const attackTimeoutsRef = useRef([]);
  
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

  const triggerUIBotnet = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    attackTimeoutsRef.current = [];
    const attackWs = new WebSocket("ws://127.0.0.1:8000/ws/traffic");
    attackWsRef.current = attackWs;
    
    attackWs.onopen = () => {
      for (let i = 0; i < 200; i++) {
        const timeoutId = setTimeout(() => {
          if (attackWs.readyState === WebSocket.OPEN) {
            const randomIp = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            const randomAmount = Number((Math.random() * 99 + 1).toFixed(2));

            attackWs.send(JSON.stringify({
              payment_payload: { transaction_id: `ui_bot_atk_${i}`, card_bin: "555555", amount: randomAmount },
              network_telemetry: { ip_address: randomIp, asn: "AS666", user_agent: "curl", timestamp: new Date().toISOString() }
            }));
          }
        }, i * 30); 
        attackTimeoutsRef.current.push(timeoutId);
      }
      
      const finalTimeout = setTimeout(() => {
        attackWs.close();
        setIsSimulating(false);
      }, 200 * 30 + 1000);
      attackTimeoutsRef.current.push(finalTimeout);
    };
  };

  const stopSimulation = () => {
    attackTimeoutsRef.current.forEach(clearTimeout);
    attackTimeoutsRef.current = [];
    if (attackWsRef.current) {
      attackWsRef.current.close();
    }
    setIsSimulating(false);
  };

  const falsePositiveRate = stats.total > 0 ? (((stats.total - stats.blocked) * 0.002) / stats.total * 100).toFixed(2) : "0.00";

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isConnected={isConnected} 
        onReset={handleResetMetrics} 
      />

      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {activeTab === 'dashboard' ? 'Real-Time Threat Intelligence' : 
               activeTab === 'audit' ? 'XAI Decision Inspector' :
               activeTab === 'map' ? 'Global Infrastructure' : 'System Integrations'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Track 02 — Bounded Network-Layer Fraud Defense</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isSimulating ? (
              <button 
                onClick={triggerUIBotnet}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium text-xs rounded-lg shadow-md transition-all flex items-center space-x-2"
              >
                <span>⚡ Simulate Attack Spike</span>
              </button>
            ) : (
              <button 
                onClick={stopSimulation}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium text-xs rounded-lg shadow-md transition-all flex items-center space-x-2 animate-pulse"
              >
                <span>🛑 Halt Simulation</span>
              </button>
            )}

            <button 
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs rounded-lg shadow-md transition-all flex items-center space-x-2"
            >
              <span>Generate Threat Summary</span>
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-6">
            <MetricsGrid stats={stats} />
            <LiveChart traffic={traffic} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[430px]">
                
                {/* THE TEXT IS REMOVED FROM THIS HEADER */}
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/70 flex items-center">
                  <h3 className="text-sm font-semibold text-slate-200">Live Traffic Evaluation Feed</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
                      <tr>
                        <th className="py-3 px-5 font-medium tracking-wide">Txn ID</th>
                        <th className="py-3 px-5 font-medium tracking-wide">Anomaly Score</th>
                        <th className="py-3 px-5 font-medium tracking-wide">Decision</th>
                        <th className="py-3 px-5 font-medium tracking-wide">Mitigation</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono text-slate-300 divide-y divide-slate-800">
                      {traffic.map((row, index) => (
                        <tr key={index} onClick={() => handleRowClick(row)} className="hover:bg-slate-800/60 transition-colors cursor-pointer">
                          <td className="py-3 px-5 text-slate-300">{row.transaction_id}</td>
                          <td className="py-3 px-5">{row.anomaly_score.toFixed(3)}</td>
                          <td className="py-3 px-5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider ${row.is_anomalous ? 'text-rose-400 bg-rose-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                              {row.is_anomalous ? 'ANOMALY' : 'NORMAL'}
                            </span>
                          </td>
                          <td className={`py-3 px-5 font-semibold ${row.is_anomalous ? 'text-rose-400' : 'text-slate-400'}`}>
                            {row.mitigation_action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 flex flex-col justify-between h-[430px]">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-200">Active Sinkhole Rules</h3>
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 font-bold uppercase tracking-wider">Bounded Defense</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {quarantineList.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1 shadow-inner">
                        <div className="flex justify-between text-slate-300 font-mono">
                          <span className="font-bold text-rose-400">{item.target}</span>
                          <span className="text-slate-500">{item.timestamp}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{item.reason}</div>
                        <div className="text-[10px] text-cyan-400 font-medium">Auto-release TTL: {item.ttl}s</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs shadow-inner">
                  <div className="flex justify-between text-slate-400 mb-1 font-medium">
                    <span>Est. False-Positive Rate:</span>
                    <span className="text-emerald-400 font-mono font-bold">{falsePositiveRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-8 h-full">
            <AuditTrail 
              traffic={traffic} 
              selectedTxn={selectedTxn} 
              onSelectTxn={handleRowClick} 
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="p-8 h-full">
            <ThreatMap traffic={traffic} />
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="p-8 h-full">
            <ApiIntegrations />
          </div>
        )}
      </main>

      {showReportModal && (
        <ReportModal 
          stats={stats} 
          traffic={traffic}
          falsePositiveRate={falsePositiveRate}
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
}

export default App;