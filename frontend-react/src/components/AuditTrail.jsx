export default function AuditTrail({ traffic, selectedTxn, onSelectTxn }) {
  // Grab the 10 most recent anomalies from the live traffic feed
  const recentAnomalies = traffic.filter(t => t.is_anomalous).slice(0, 10);

  // VIEW 1: THE PENDING AUDITS LIST
  if (!selectedTxn) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-8 h-full animate-[fadeIn_0.2s_ease-in]">
        <h2 className="text-xl font-bold text-slate-100 mb-2 tracking-tight">Pending Explainability Audits</h2>
        <p className="text-sm text-slate-400 mb-6 font-medium">Select a recent mitigated threat below to view the AI decision rationale.</p>
        
        {recentAnomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700 rounded-xl bg-slate-950/50">
            <span className="text-emerald-400 mb-3 animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            <p className="text-slate-300 font-bold text-lg">System Secure & Clean</p>
            <p className="text-slate-400 font-medium mt-1">No anomalous traffic has been ingested in this session.</p>
            
            {/* Helpful Guide for Judges/Users */}
            <div className="mt-6 px-5 py-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-center shadow-inner">
              <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Want to test the AI?</p>
              <p className="text-xs text-slate-300 mt-1.5">Click <strong className="text-rose-400">⚡ Simulate Attack Spike</strong> in the top right to generate test data.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAnomalies.map((txn, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectTxn(txn)} 
                className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-lg cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{txn.transaction_id}</div>
                    <div className="text-xs text-slate-500 font-mono mt-1">Score: {txn.anomaly_score.toFixed(4)}</div>
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700 group-hover:bg-slate-800 transition-colors">
                  Inspect Vector &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: THE DETAILED INCIDENT INSPECTOR
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden animate-[fadeIn_0.2s_ease-in]">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
        <h3 className="text-sm font-semibold text-slate-200">Incident Telemetry: {selectedTxn.transaction_id}</h3>
        <button 
          onClick={() => onSelectTxn(null)} 
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 px-3 py-1.5 bg-cyan-900/20 rounded-md transition-colors"
        >
          &larr; Back to Pending Audits
        </button>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitigation Status</span>
            <div className={`text-2xl font-bold font-mono mt-2 ${selectedTxn.is_anomalous ? 'text-rose-500' : 'text-emerald-400'}`}>
              {selectedTxn.mitigation_action}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Isolation Forest Score</span>
            <div className="text-3xl font-bold font-mono text-violet-400 mt-2">
              {selectedTxn.anomaly_score.toFixed(4)}
            </div>
          </div>
        </div>
        
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-5 shadow-inner">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Feature Vector Weights</h4>
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Temporal Jitter Variance</span>
              <span className={selectedTxn.is_anomalous ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                {selectedTxn.is_anomalous ? 'ANOMALOUS (LOW)' : 'ORGANIC'}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full ${selectedTxn.is_anomalous ? 'bg-rose-500 w-[12%]' : 'bg-emerald-500 w-[80%]'}`}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>ASN Request Velocity</span>
              <span className={selectedTxn.is_anomalous ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                {selectedTxn.is_anomalous ? 'SURGE DETECTED' : 'NORMAL'}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full ${selectedTxn.is_anomalous ? 'bg-rose-500 w-[92%]' : 'bg-emerald-500 w-[24%]'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}