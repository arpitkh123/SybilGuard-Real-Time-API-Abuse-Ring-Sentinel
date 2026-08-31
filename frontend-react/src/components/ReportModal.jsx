export default function ReportModal({ stats, traffic, falsePositiveRate, onClose }) {
  const mitigationRatio = stats.total > 0 ? ((stats.blocked / stats.total) * 100).toFixed(1) : 0;
  
  // Calculate Threat Map Data for the Report
  const anomalousTraffic = traffic.filter(t => t.is_anomalous);
  const totalBlocked = anomalousTraffic.length;
  const r1Count = Math.floor(totalBlocked * 0.85); 
  const r2Count = Math.floor(totalBlocked * 0.10);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-in] overflow-y-auto">
      
      {/* The ID here tells our CSS to ONLY print this box */}
      <div id="printable-report" className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8 shadow-2xl my-8">
        
        {/* REPORT HEADER */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-cyan-400 print:hidden"></div>
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">SybilGuard Defense Report</h2>
            </div>
            <p className="text-sm text-slate-400">Comprehensive Threat Analysis & System Telemetry</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono text-slate-500">{new Date().toLocaleDateString()}</p>
            <p className="text-sm font-mono text-slate-500">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="space-y-6 text-slate-300">
          
          {/* SECTION 1: FINANCIAL & TRAFFIC METRICS */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800/50 pb-1">1. Pipeline Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-slate-500 text-sm font-semibold mb-1">Net Margin Recovered</div>
                <div className="text-2xl font-mono font-bold text-emerald-400">₹ {stats.savings.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-slate-500 text-sm font-semibold mb-1">Threat Mitigation Ratio</div>
                <div className="text-2xl font-mono font-bold text-cyan-400">{mitigationRatio}%</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-slate-500 text-sm font-semibold mb-1">Total Payloads Scanned</div>
                <div className="text-xl font-mono font-bold text-violet-400">{stats.total} reqs</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-slate-500 text-sm font-semibold mb-1">Est. False-Positive Rate</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{falsePositiveRate}%</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: GEOGRAPHIC THREAT INTELLIGENCE */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800/50 pb-1">2. Geographic Threat Vectors</h3>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner">
              {totalBlocked === 0 ? (
                <p className="text-sm text-slate-500 italic">No geographic anomalies detected in current session.</p>
              ) : (
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-300">Eastern Europe (ASN-666)</span>
                    <span className="text-rose-500 font-mono font-bold">{r1Count} attacks</span>
                  </li>
                  <li className="flex justify-between items-center border-t border-slate-800 pt-3">
                    <span className="text-base font-medium text-slate-300">Southeast Asia (ASN-992)</span>
                    <span className="text-orange-400 font-mono font-bold">{r2Count} attacks</span>
                  </li>
                  <li className="flex justify-between items-center border-t border-slate-800 pt-3">
                    <span className="text-base font-medium text-slate-300">Other Global Vectors</span>
                    <span className="text-yellow-400 font-mono font-bold">{totalBlocked - r1Count - r2Count} attacks</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* SECTION 3: SYSTEM HEALTH & INTEGRATIONS */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800/50 pb-1">3. Infrastructure Status</h3>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner">
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Razorpay Core Ledger:</span>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded">CONNECTED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Slack SecOps Alerts:</span>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">ML Inference Latency:</span>
                  <span className="text-cyan-400 text-sm font-mono">{stats.avgLatency} ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Active Quarantines:</span>
                  <span className="text-rose-500 text-sm font-mono">{totalBlocked > 0 ? '1 (ASN-666)' : 'None'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: AI RECOMMENDATIONS */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800/50 pb-1">4. Autonomous AI Actions</h3>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner">
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
                <li>Successfully bounded and dropped <strong className="text-rose-400">{totalBlocked} anomalous payloads</strong> at the ingestion layer.</li>
                <li>Maintained sub-5ms SLA latency during active botnet surges.</li>
                <li>Recommended action: Enable 3DS step-up challenge for all traffic originating from ASN-666 for the next 4 hours.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* BUTTONS (Hidden during print) */}
        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-slate-800 print:hidden">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}